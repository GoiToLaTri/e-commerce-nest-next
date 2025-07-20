import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserInteractionService } from '../user-interaction/user-interaction.service';
import { IFlatProduct } from './interfaces/flat-product.interface';
import { IProduct } from '../product/interfaces/product.interface';
import { IUserInteraction } from '../user-interaction/interfaces/user-interaction.interface';
import { IUserProfile } from './interfaces/user-profile.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RecommendationService {
  private interactions: IUserInteraction[] = [];
  private products: IFlatProduct[] = [];
  private userProfiles: Map<string, IUserProfile> = new Map();
  // Trọng số ưu tiên theo action
  private readonly ACTION_WEIGHTS = {
    PURCHASE: 10,
    ADDTOCART: 7,
    LIKE: 5,
    WISHLIST: 5,
    VIEW: 1,
  };

  // Trọng số cho từng feature của sản phẩm
  private readonly FEATURE_WEIGHTS = {
    brand_name: 0.15,
    cpu_brand: 0.12,
    cpu_family: 0.1,
    cpu_series: 0.08,
    gpu_brand: 0.12,
    gpu_manufacturer: 0.08,
    gpu_model: 0.1,
    gpu_series: 0.08,
    display_panel_type: 0.06,
    display_refresh_rate: 0.05,
    display_resolution: 0.06,
    ram_capacity: 0.08,
    ram_type: 0.04,
    storage_type: 0.04,
    storage_capacity: 0.04,
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly userInteractionService: UserInteractionService,
    private readonly redis: RedisService,
  ) {}

  private async loadInteractions(userid: string) {
    const rawData = await this.userInteractionService.findByUserId(userid);

    if (!rawData || rawData.length === 0) return (this.interactions = []);
    this.interactions = rawData.map((interaction) => ({
      action: interaction.action,
      created_at: interaction.created_at,
      id: interaction.id,
      productId: interaction.productId,
      updated_at: interaction.updated_at,
      userId: userid,
    }));
  }

  private async loadProducts() {
    const interactedProducts = (await this.prisma.product.findMany({
      select: {
        id: true,
        thumbnail: true,
        model: true,
        LaptopBrand: { select: { name: true } },
        Processor: {
          select: {
            brand: true,
            family: true,
            series: true,
            generation: true,
          },
        },
        VideoGraphics: {
          select: {
            brand: true,
            manufacturer: true,
            model: true,
            memory_type: true,
            series: true,
            prefix: true,
            vram_gb: true,
          },
        },
        Display: {
          select: {
            brightness: true,
            color_coverage: true,
            panel_type: true,
            ratio: true,
            refresh_rate: true,
            resolution: true,
            response_time: true,
          },
        },
        Memory: {
          select: {
            capacity: true,
            speed: true,
            type: true,
          },
        },
        Storage: {
          select: {
            capacity: true,
            interface: true,
            max_capacity: true,
            type: true,
          },
        },
      },
    })) as IProduct[];
    if (!interactedProducts) return [];
    this.products = this.flatData(interactedProducts);
  }

  private buildUserProfiles(): void {
    // Tạo profile cho từng user dựa trên lịch sử tương tác
    this.interactions.forEach((interaction) => {
      const { userId, productId, action } = interaction;

      if (!this.userProfiles.has(userId)) {
        this.userProfiles.set(userId, {
          userId,
          preferredFeatures: new Map(),
          totalInteractionScore: 0,
        });
      }

      const userProfile = this.userProfiles.get(userId)!;
      const product = this.products.find((p) => p.product_id === productId);

      if (product) {
        const actionWeight =
          this.ACTION_WEIGHTS[action as keyof typeof this.ACTION_WEIGHTS] || 1;
        userProfile.totalInteractionScore += actionWeight;

        // Cập nhật preference cho từng feature
        Object.entries(this.FEATURE_WEIGHTS).forEach(
          ([feature, featureWeight]) => {
            const featureValue = product[feature as keyof IFlatProduct];
            if (featureValue && featureValue !== '-' && featureValue !== '') {
              const featureKey = `${feature}:${featureValue}`;
              const currentScore =
                userProfile.preferredFeatures.get(featureKey) || 0;
              userProfile.preferredFeatures.set(
                featureKey,
                currentScore + actionWeight * featureWeight,
              );
            }
          },
        );
      }
    });

    // Normalize scores
    this.userProfiles.forEach((profile) => {
      profile.preferredFeatures.forEach((score, feature) => {
        profile.preferredFeatures.set(
          feature,
          score / profile.totalInteractionScore,
        );
      });
    });

    console.log(`Built profiles for ${this.userProfiles.size} users`);
    console.log(this.userProfiles);
  }

  private calculateProductScore(userId: string, product: IFlatProduct): number {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(this.FEATURE_WEIGHTS).forEach(([feature, featureWeight]) => {
      const featureValue = product[feature as keyof IFlatProduct];
      if (featureValue && featureValue !== '-' && featureValue !== '') {
        const featureKey = `${feature}:${featureValue}`;
        const userPreference =
          userProfile.preferredFeatures.get(featureKey) || 0;
        totalScore += userPreference * featureWeight;
        totalWeight += featureWeight;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  getRecommendations(userid: string, topK = 4) {
    const userProfile = this.userProfiles.get(userid);
    if (!userProfile) return [];

    // Lấy danh sách sản phẩm user đã tương tác
    const interactedProducts = new Set(
      this.interactions
        .filter((i) => i.userId === userid)
        .map((i) => i.productId),
    );

    // Tính score cho tất cả sản phẩm chưa tương tác
    const recommendations = this.products
      .filter((product) => !interactedProducts.has(product.product_id))
      .map((product) => ({
        productId: product.product_id,
        score: this.calculateProductScore(userid, product),
        product,
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return recommendations;
  }

  getUserProfile(userId: string): IUserProfile | undefined {
    return this.userProfiles.get(userId);
  }

  analyzeUserPreferences(userId: string): void {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) {
      console.log(`User ${userId} not found`);
      return;
    }

    console.log(`\n=== User ${userId} Preferences ===`);
    console.log(
      `Total Interaction Score: ${userProfile.totalInteractionScore}`,
    );

    // Sắp xếp preferences theo score
    const sortedPreferences = Array.from(
      userProfile.preferredFeatures.entries(),
    )
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    console.log('\nTop Preferences:');
    sortedPreferences.forEach(([feature, score]) => {
      console.log(`  ${feature}: ${score.toFixed(4)}`);
    });
  }

  getProductDetails(productId: string): IFlatProduct | undefined {
    return this.products.find((p) => p.product_id === productId);
  }

  async loadData(userId: string): Promise<void> {
    await Promise.all([this.loadInteractions(userId), this.loadProducts()]);
    this.buildUserProfiles();
  }

  private flatData(data: IProduct[]): IFlatProduct[] {
    return data.map((item) => ({
      product_id: item.id,
      product_model: item.model,
      product_thumbnail: item.thumbnail,
      brand_name: item.LaptopBrand?.name || null,
      cpu_brand: item.Processor?.brand || null,
      cpu_family: item.Processor?.family || null,
      cpu_series: item.Processor?.series || null,
      cpu_generation: item.Processor?.generation || null,
      gpu_brand: item.VideoGraphics?.brand || null,
      gpu_manufacturer: item.VideoGraphics?.manufacturer || null,
      gpu_model: item.VideoGraphics?.model || null,
      gpu_memory_type: item.VideoGraphics?.memory_type || null,
      gpu_series: item.VideoGraphics?.series || null,
      gpu_prefix: item.VideoGraphics?.prefix || null,
      gpu_vram_gb: item.VideoGraphics?.vram_gb || null,
      display_brightness: item.Display?.brightness || null,
      display_color_coverage: item.Display?.color_coverage || null,
      display_panel_type: item.Display?.panel_type || null,
      display_ratio: item.Display?.ratio || null,
      display_refresh_rate: item.Display?.refresh_rate || null,
      display_resolution: item.Display?.resolution || null,
      display_response_time: item.Display?.response_time || null,
      ram_capacity: item.Memory?.capacity || null,
      ram_speed: item.Memory?.speed || null,
      ram_type: item.Memory?.type || null,
      storage_capacity: item.Storage?.capacity || null,
      storage_interface: item.Storage?.interface || null,
      storage_max_capacity: item.Storage?.max_capacity || null,
      storage_type: item.Storage?.type || null,
    }));
  }

  async recommend(userId: string, topK = 4) {
    console.log('Loading data...');
    await this.loadData(userId);

    // Analyze user preferences
    this.analyzeUserPreferences(userId);

    // Get recommendations
    // console.log(`\n=== Recommendations for User ${userId} ===`);
    const recommendations = this.getRecommendations(userId, topK);

    // recommendations.forEach((rec, index) => {
    //   const product = rec.product;
    //   console.log(`\n${index + 1}. Product ID: ${rec.productId}`);
    //   console.log(`   Score: ${rec.score.toFixed(4)}`);
    //   console.log(`   Brand: ${product.brand_name}`);
    //   console.log(
    //     `   CPU: ${product.cpu_brand} ${product.cpu_family} ${product.cpu_series}`,
    //   );
    //   console.log(`   GPU: ${product.gpu_manufacturer} ${product.gpu_model}`);
    //   console.log(`   RAM: ${product.ram_capacity} ${product.ram_type}`);
    //   console.log(
    //     `   Display: ${product.display_resolution} ${product.display_refresh_rate}`,
    //   );
    // });

    return recommendations.map((pd) => ({
      id: pd.productId,
      thumbnail: pd.product.product_thumbnail,
      model: pd.product.product_model,
      score: pd.score,
    }));
  }
}
