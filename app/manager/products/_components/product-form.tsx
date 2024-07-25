"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { useUploadThing } from "@/hooks/use-upload-thing"
import { createProduct, editProduct } from "@/lib/api/actions/products"
import type { Product } from "@/lib/db/schema"
import { cn } from "@/lib/utils"
import {
  type NewProductValues,
  newProductSchema,
} from "@/lib/validations/products"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft, Upload } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ImageInput } from "./image-input"
import { ImagePreview } from "./image-preview"

type FileWithURL = { file: File; url: string }

interface ProductFormProps {
  product?: Product & { imageUrls: string[] }
}

export function ProductForm({ product }: ProductFormProps) {
  const form = useForm<NewProductValues>({
    resolver: zodResolver(newProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? null,
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      isPublished: product?.isPublished ?? false,
      imageUrls: product?.imageUrls ?? [],
    },
  })

  const [imageFiles, setImageFiles] = useState<FileWithURL[]>([])
  let uploadToastId: number | string | undefined
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin: () => {
      uploadToastId = toast.loading("Uploading images...")
    },
    onClientUploadComplete: () => {
      toast.success("Images uploaded successfully!", {
        id: uploadToastId,
      })
    },
    onUploadError: () => {
      toast.error("Failed to upload images.", {
        id: uploadToastId,
      })
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

  const onSubmit = async (values: NewProductValues) => {
    const uploadResult =
      imageFiles.length > 0
        ? await startUpload(imageFiles.map(({ file }) => file))
        : undefined

    const unchangedImages = uploadResult
      ? values.imageUrls.slice(0, values.imageUrls.length - uploadResult.length)
      : []

    const input = {
      ...values,
      imageUrls: !uploadResult
        ? values.imageUrls
        : [...unchangedImages, ...uploadResult.map((res) => res.url)],
    }

    if (product) editProductAction({ ...input, id: product.id })
    else createProductAction(input)
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
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>
                  Add up to 4 images for the product. First image will be the
                  main image.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 grid-rows-[1fr_auto_auto] grid-cols-3">
                  <FormField
                    control={form.control}
                    name="imageUrls"
                    render={({ field }) => (
                      <>
                        {field.value.map((imageUrl, index) => (
                          <ImagePreview
                            key={imageUrl}
                            url={imageUrl}
                            index={index}
                            onRemove={(url) => {
                              field.onChange(
                                field.value.filter(
                                  (imageUrl) => imageUrl !== url,
                                ),
                              )
                              setImageFiles((prevImages) =>
                                prevImages.filter(
                                  ({ url }) => url !== imageUrl,
                                ),
                              )
                              URL.revokeObjectURL(url)
                            }}
                          />
                        ))}
                        <FormItem className="first:col-span-full">
                          <FormLabel
                            className={cn(
                              "cursor-pointer flex aspect-square w-full items-center justify-center rounded-md border border-dashed",
                              field.value.length === 4 && "hidden",
                            )}
                          >
                            <Upload className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Upload</span>
                          </FormLabel>
                          <FormControl>
                            <ImageInput
                              disabled={field.value.length === 4 || isUploading}
                              onChange={(file) => {
                                const url = URL.createObjectURL(file)
                                field.onChange([...field.value, url])
                                setImageFiles((prevImages) => [
                                  ...prevImages,
                                  { file, url },
                                ])
                              }}
                            />
                          </FormControl>
                        </FormItem>
                        <FormMessage className="row-start-3 col-span-full" />
                      </>
                    )}
                  />
                </div>
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
