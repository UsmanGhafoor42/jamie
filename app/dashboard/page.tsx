import { redirect } from "next/navigation";

const page = () => {
  redirect("/dashboard/add-product");
};

export default page;
