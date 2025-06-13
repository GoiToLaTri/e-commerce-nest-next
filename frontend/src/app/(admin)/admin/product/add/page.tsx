import ProductImageForm from "@/components/forms/product-image-form";
import ProductInfoForm from "@/components/forms/product-info-form";
import Card from "@/components/ui/cards/card";
import React from "react";

export default function AddProduct() {
  return (
    <div className="flex gap-4 justify-stretch">
      <div className="product-image-form w-[40%] h-full">
        <Card>
          <div className="w-full">
            <h2 className="font-semibold text-xl mb-1 text-white">
              Product Images
            </h2>
            <ProductImageForm />
          </div>
        </Card>
      </div>

      <div className="product-info-form w-[60%] h-full">
        <Card>
          <div>
            <h2 className="font-semibold text-xl mb-1 text-white">
              Product Information
            </h2>
            <div>
              <ProductInfoForm />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
