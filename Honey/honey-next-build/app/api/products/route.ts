import { honeyList } from "@/data/products"

export async function GET() {
  return Response.json(honeyList)
}
