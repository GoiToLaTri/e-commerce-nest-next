import {
  ICPUInfo,
  IDisplayInfo,
  IGPUInfo,
  IRamInfo,
  IStorageInfo,
} from '@/modules/product/interfaces';

class ProductUtil {
  public parseCpuName(cpuName: string): ICPUInfo | null {
    const cleanedName = cpuName.trim();

    // Intel Core iX 13500H
    const intelRegex =
      /Intel\s+(Core|Pentium|Celeron)\s+(i[3579])\s+(\d{4,5})([A-Z]*)/i;
    const intelMatch = cleanedName.match(intelRegex);

    if (intelMatch) {
      const [, family, series, skuNumber, suffixRaw] = intelMatch;
      const generation = parseInt(skuNumber.slice(0, 2), 10);
      const suffix = suffixRaw || undefined;

      return {
        brand: 'Intel',
        family,
        series,
        generation,
        sku: skuNumber + suffixRaw,
        suffix,
        model: cpuName,
        is_laptop: /[HU]$/.test(suffixRaw),
      };
    }

    // AMD Ryzen 5 7840HS
    const amdRegex = /AMD\s+(Ryzen|Athlon)\s+(\d)\s+(\d{4})([A-Z]*)/i;
    const amdMatch = cleanedName.match(amdRegex);

    if (amdMatch) {
      const [, family, seriesDigit, skuNumber, suffixRaw] = amdMatch;
      const generation = parseInt(skuNumber[0], 10); // 7xxx → Gen 7
      const suffix = suffixRaw || undefined;

      return {
        brand: 'AMD',
        family,
        series: `Ryzen ${seriesDigit}`,
        generation,
        sku: skuNumber + suffixRaw,
        suffix,
        model: cpuName,
        is_laptop: /(H|U|HS|HX|GE)$/i.test(suffixRaw),
        has_integrated_gpu: /G|U|GE/i.test(suffixRaw),
      };
    }

    return null; // không khớp mẫu nào
  }

  public parseGPUName(input: string): IGPUInfo | null {
    const regex =
      /^(?<manufacturer>NVIDIA|AMD|Intel)\s+(?<brand>GeForce|Radeon|Arc)\s+(?<prefix>GTX|RTX|RX|Arc)\s+(?<modelNumber>\d{3,4})\s*(?<modelSuffix>Ti|XT|XTX|Super|Pro|M)?\s*(?<vram>\d+)?\s*GB?\s*(?<memoryType>GDDR\dX?)?/i;

    const match = input.match(regex);
    if (!match?.groups) return null;

    const {
      manufacturer,
      brand,
      prefix,
      modelNumber,
      modelSuffix,
      vram,
      memoryType,
    } = match.groups;

    const model = `${modelNumber}${modelSuffix ? ' ' + modelSuffix : ''}`;
    const series = modelNumber.slice(0, 2);
    const fullNameParts = [manufacturer, brand, prefix, model];

    // Thêm VRAM và memoryType nếu có
    if (vram) fullNameParts.push(`${vram}GB`);
    if (memoryType) fullNameParts.push(memoryType.toUpperCase());

    return {
      manufacturer: manufacturer as IGPUInfo['manufacturer'],
      brand,
      prefix,
      series,
      model,
      vram_gb: vram ? parseInt(vram, 10) : null,
      memory_type: memoryType ? memoryType.toUpperCase() : null,
      name: fullNameParts.join(' '),
    };
  }

  public parseDisplayInfo(input: string): IDisplayInfo | null {
    // const regex =
    //   /^(\d{1,2}(?:\.\d{1,2})?)["”]\s+(\d{1,2}:\d{1,2})\s+(IPS|OLED|VA|TN|Mini-LED|PLS)(?:\s+(\w+))?\s+\((\d{3,4})[×xX](\d{3,4})\)\s+(\d{2,3})Hz,\s*(\d{1,2})ms,\s*(sRGB|AdobeRGB|DCI-P3)\s+(\d{1,3})%,\s*(\d{2,4})nits$/i;

    const regex =
      /^(\d{1,2}(?:\.\d{1,2})?)["”]\s+(\d{1,2}:\d{1,2})\s+(IPS|OLED|VA|TN|Mini-LED|PLS)(?:\s+(\w+))?\s+\((\d{3,4})[×xX](\d{3,4})\)\s+(\d{2,3})Hz(?:,\s*(\d{1,2})ms)?(?:,\s*)?(\d{1,3})%\s+(sRGB|AdobeRGB|DCI-P3|NTSC)(?:,\s*)?(\d{2,4})nits$/i;

    const match = input.match(regex);
    if (!match) return null;

    const [
      ,
      size,
      ratio,
      panel,
      resolutionLabel, // <- tùy chọn (có thể là "WQXGA", "FHD+"...)
      resWidth,
      resHeight,
      refreshRate,
      responseTime,
      colorPercent,
      colorSpace,
      brightness,
    ] = match;

    return {
      size: `${size}"`,
      ratio,
      panel_type: panel.toUpperCase(),
      resolution: `${resWidth}×${resHeight}`,
      resolution_label: resolutionLabel?.toUpperCase(),
      refresh_rate: `${refreshRate}Hz`,
      response_time: `${responseTime}ms`,
      color_coverage: `${colorSpace.toUpperCase()} ${colorPercent}%`,
      brightness: `${brightness}nits`,
      info: input.trim(),
    };
  }

  public parseRamInfo(input: string): IRamInfo | null {
    const regex =
      /(?:(\d+)x)?\s*(\d+)\s*GB\s+([A-Z0-9]+)\s+(\d+)\s*MHz(?:.*?up to\s*(\d+)\s*GB)?/i;

    const match = input.match(regex);
    if (!match) return null;

    const [, sticksStr, sizeStr, type, speedStr, maxStr] = match;

    const sticks = sticksStr ? parseInt(sticksStr, 10) : 1;
    const sizePerStick = parseInt(sizeStr, 10);
    const speed = `${speedStr}MHz`;
    const totalCapacity = sticks * sizePerStick;
    const capacity = `${totalCapacity}GB`;
    const maxCapacityVal = maxStr ? parseInt(maxStr, 10) : totalCapacity;
    const max_capacity = `${maxCapacityVal}GB`;

    // Nếu tổng dung lượng thực tế > dung lượng tối đa thì vô lý
    if (totalCapacity > maxCapacityVal) return null;

    const slots = maxStr ? Math.ceil(maxCapacityVal / sizePerStick) : null;

    return {
      capacity,
      max_capacity,
      type: type.toUpperCase(),
      speed,
      slots,
      sticks,
      info: input.trim(),
    };
  }

  public parseStorageInfo(input: string): IStorageInfo | null {
    const cleanedInput = input.trim();

    // Regex: bắt phần "1x 512GB PCIe Gen4x4 NVMe TLC M.2 SSD"
    const baseRegex =
      /(?:(\d+)x)?\s*(\d+)\s*GB\s+(PCIe\s+Gen\d+(?:x\d+)?)(?:\s+[\w\-]+)*\s+M\.2\s+(SSD|HDD)/i;

    // Regex: bắt phần "up to 2TB"
    const maxRegex = /up to\s+(\d+(?:\.\d+)?)\s*(TB|GB)/i;

    // Regex: bắt phần "2x M.2 slots"
    const slotRegex = /(\d+)x\s*M\.2\s*slots?/i;

    // 1. Match phần chính (base)
    const baseMatch = cleanedInput.match(baseRegex);
    if (!baseMatch) return null;

    const [, countStr, sizeStr, interfaceStr, typeRaw] = baseMatch;

    const count = countStr ? parseInt(countStr, 10) : 1;
    const sizePerDrive = parseInt(sizeStr, 10);
    const totalGB = count * sizePerDrive;
    const capacity = totalGB >= 1024 ? `${totalGB / 1024}TB` : `${totalGB}GB`;

    // 2. Match max capacity
    const maxMatch = cleanedInput.match(maxRegex);
    if (!maxMatch) return null;

    const [, maxValStr, maxUnit] = maxMatch;
    const maxInGB =
      maxUnit.toUpperCase() === 'TB'
        ? parseFloat(maxValStr) * 1024
        : parseFloat(maxValStr);

    if (totalGB > maxInGB) return null;
    const max_capacity = `${maxValStr}${maxUnit.toUpperCase()}`;

    // 3. Match slot count
    const slotMatch = cleanedInput.match(slotRegex);
    const slots = slotMatch ? parseInt(slotMatch[1], 10) : 1;

    // 4. Loại ổ đĩa: Chỉ SSD hoặc HDD
    const type = typeRaw.toUpperCase();
    if (!['SSD', 'HDD'].includes(type)) return null;

    // 5. Nếu input chứa chuỗi sai chính tả như HDDE thì loại
    if (/HDDE/i.test(cleanedInput)) return null;

    return {
      capacity,
      max_capacity,
      type: type as 'SSD' | 'HDD',
      interface: interfaceStr.trim(),
      slots,
      info: cleanedInput,
    };
  }

  public cleanDisplayInput(input: string): string {
    let result = input.trim();

    // 1. Chuẩn hóa khoảng trắng
    result = result.replace(/\s+/g, ' ');

    // 2. Đổi dấu ngoặc kép Unicode “ ” thành dấu "
    result = result.replace(/[“”]/g, '"');

    // 3. Đảm bảo có dấu " sau kích thước màn hình nếu bị thiếu
    // Điều kiện: chỉ chèn nếu chưa có dấu " nào
    const hasInch = /(\d{1,2}(?:\.\d{1,2})?)"/.test(result);
    if (!hasInch) {
      result = result.replace(
        /^(\d{1,2}(?:\.\d{1,2})?)\b/,
        '$1"', // thêm dấu "
      );
    }

    // 4. Thay 'x' thường thành '×' trong độ phân giải
    result = result.replace(/(\d{3,4})\s*[xX]\s*(\d{3,4})/, '$1×$2');

    // 5. Tự động thêm resolution label (ví dụ: FHD) nếu thiếu
    const hasResLabel =
      /\b(FHD\+?|QHD\+?|WQXGA|UHD|HD\+?|3K|4K|5K|Retina)\b/i.test(result);
    const hasPanel = /\b(IPS|OLED|VA|TN|Mini-LED|PLS)\b/i.test(result);
    if (!hasResLabel && hasPanel) {
      result = result.replace(/\b(IPS|OLED|VA|TN|Mini-LED|PLS)\b/i, '$1 FHD');
    }

    // 6. Tự động thêm aspect ratio nếu thiếu
    const hasAspectRatio = /\b\d{1,2}:\d{1,2}\b/.test(result);
    const resolutionMatch = result.match(/(\d{3,4})×(\d{3,4})/);
    if (!hasAspectRatio && resolutionMatch) {
      const width = parseInt(resolutionMatch[1], 10);
      const height = parseInt(resolutionMatch[2], 10);
      const aspect = this.getAspectRatio(width, height);
      if (aspect)
        result = result.replace(/(\d{1,2}(?:\.\d{1,2})?")/, `$1 ${aspect}`);
    }

    return result;
  }

  public getAspectRatio(width: number, height: number): string | undefined {
    const ratio = parseFloat((width / height).toFixed(2));
    if (Math.abs(ratio - 1.78) < 0.05) return '16:9';
    if (Math.abs(ratio - 1.6) < 0.05) return '16:10';
    if (Math.abs(ratio - 1.5) < 0.05) return '3:2';
    if (Math.abs(ratio - 1.33) < 0.05) return '4:3';
    return undefined;
  }
}

export const productUtil = new ProductUtil();
