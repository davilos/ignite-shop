import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";

import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

import { HomeContainer, Product } from "@/styles/pages/home";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurDataUrl";

interface HomeProps {
  products: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    blurHash: string;
    price: number;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <HomeContainer ref={sliderRef} className="keen-slider">
      {products.map((product) => {
        return (
          <Link key={product.id} href={`/product/${product.id}`}>
            <Product className="keen-slider__slide">
              <Image
                src={product.imageUrl}
                width={520}
                height={480}
                alt=""
                placeholder="blur"
                blurDataURL={product.blurHash}
              />

              <footer>
                <strong>{product.name}</strong>
                <span>{product.price}</span>
              </footer>
            </Product>
          </Link>
        );
      })}
    </HomeContainer>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const products = await Promise.all(
    response.data.map(async (product) => {
      const defaultPrice = product.default_price as Stripe.Price;
      const blurHash = await dynamicBlurDataUrl(product.images[0]);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.images[0],
        blurHash,
        price: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(defaultPrice.unit_amount! / 100),
      };
    })
  );

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours
  };
};
