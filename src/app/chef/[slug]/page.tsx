import type { Metadata } from "next";
import ChefDetailPage from "@/components/pages/ChefDetailPage";
import { getChefByProfileLink } from "@/services/chefs";

const normalizeChefSlug = (value?: string) => {
  if (!value) return "";
  const trimmed = decodeURIComponent(value)
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (!trimmed) return "";
  return trimmed.startsWith("chef/") ? trimmed.slice(5) : trimmed;
};

async function getChefBySlug(slug: string) {
  const targetSlug = normalizeChefSlug(slug);
  if (!targetSlug) return null;
  return await getChefByProfileLink(targetSlug).catch(() => null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getChefBySlug(slug);

  return {
    title: post?.name ?? "Chef Profile",
    description:
      post?.specialty ??
      "Read this article from the Zestify blog for food tips, recipes, and restaurant updates.",
    openGraph: {
      title: post?.title,
      description: post?.specialty,
      images: post?.imgSrc ? [{ url: post.imgSrc }] : [],
      type: "article",
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const chefInfo = await getChefBySlug(slug);
  return <ChefDetailPage chefInfo={chefInfo as any} />;
}
