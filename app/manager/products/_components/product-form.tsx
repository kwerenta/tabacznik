"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { createProduct, editProduct } from "@/lib/api/actions/products"
import type { Product } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import {
  type NewProductValues,
  newProductSchema,
} from "@/lib/validations/products"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

interface ProductFormProps {
  product?: Product
}

export function ProductForm({ product }: ProductFormProps) {
  const form = useForm<NewProductValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: product
      ? {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          isPublished: product.isPublished,
        }
      : {
          name: "",
          description: null,
          price: 0,
          stock: 0,
          isPublished: false,
        },
  })

  const { execute: createProductAction } = useAction(createProduct, {
    onSuccess: () => {
      toast.success("Product created successfully!")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const { execute: editProductAction } = useAction(editProduct, {
    onSuccess: () => {
      toast.success("Product edited successfully!")
    },
    onError: ({ error }) => {
      toast.error(error.serverError)
    },
  })

  const onSubmit = (values: NewProductValues) => {
    if (product) editProductAction({ ...values, id: product.id })
    else createProductAction(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="flex gap-4 items-center">
          <Link
            href="/manager/products"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "icon",
                className: "size-7",
              }),
            )}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {product ? product.name : "New Product"}
          </h1>
          <Button
            type="submit"
            size="sm"
            className="hidden items-center md:ml-auto md:flex"
          >
            {product ? "Save" : "Create"} Product
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(e.target.value || null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Stock</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step={0.01}
                          {...field}
                          value={(field.value / 100).toFixed(2)}
                          onChange={(e) =>
                            field.onChange(+e.target.value * 100)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(+e.target.value ?? 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Status</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex justify-between items-center gap-4">
                      <div>
                        <FormLabel>Is published?</FormLabel>
                        <FormDescription>
                          If the product is not published, it will not be
                          visible to customers.
                        </FormDescription>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button type="submit" size="sm">
            {product ? "Save" : "Create"} Product
          </Button>
        </div>
      </form>
    </Form>
  )
}
