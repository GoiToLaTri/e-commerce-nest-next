import { NotFoundError } from "@/components/results";

export const metadata = {
  title: "EZwind",
  description: "The product you are looking for does not exist.",
};

export default function NotFound() {
  return <NotFoundError />;
}
