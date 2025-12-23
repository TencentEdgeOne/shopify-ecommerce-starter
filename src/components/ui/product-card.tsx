"use client";

import { formatPrice } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./button";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";
import { useState } from "react";

export interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  variantId: string;
  availableForSale?: boolean;
  stock?: number;
}

const ProductCard = ({ title, price, image, slug, variantId, availableForSale = true, stock }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const isSoldOut = !availableForSale || (typeof stock === "number" && stock <= 0);

  const addToCart = async () => {
    if (isSoldOut || isAdding) {
      if (isSoldOut) {
        toast.error("This item is sold out");
      }
      return;
    }
    setIsAdding(true);
    try {
      await addItem(variantId, 1);
      toast.success(`${title} has been added to cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      toast.error("Failed to add to cart. Please try again later.");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
      <Link href={`/product/${slug}`} className="block aspect-square overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        {isSoldOut && (
          <span className="absolute left-2 top-2 rounded-full bg-gray-900/80 px-3 py-1 text-xs font-semibold text-white">
            Sold out
          </span>
        )}
      </Link>
      <div className="p-4">
        <Link href={`/product/${slug}`}>
          <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        </Link>
        <p className="mb-4 text-xl font-bold text-gray-900">
          {formatPrice(price)}
        </p>
        <Button 
          onClick={addToCart}
          className="w-full cursor-pointer"
          disabled={isSoldOut || isAdding}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isAdding ? "Adding..." : isSoldOut ? "Sold out" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 