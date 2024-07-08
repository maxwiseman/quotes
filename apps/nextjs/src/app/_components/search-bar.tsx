"use client"

import type { show } from "@quotes/db";
import { Form, FormField } from "@quotes/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@quotes/ui/select"
import { usePathname, useRouter } from "next/navigation"
import { useId } from "react"
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form';
import { z } from "zod";

export function SearchBar({ shows }: { shows: (typeof show.$inferSelect)[] }): React.ReactElement {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>();
  const id = useId()
  const pathname = usePathname();

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = (data) => {
    console.log("Submitted search:", data)
    const params = new URLSearchParams(pathname)
    params.set('q', data.query)
    if (data.filterId) params.set('f', data.filterId)
    router.push(`/search?${params.toString()}`)
  }

  const formSchema = z.object({
    query: z.string(),
    filterId: z.string().optional()
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full lg:max-w-[35rem]">
        <label htmlFor={id} className="flex cursor-text h-9 w-full rounded-md border border-input items-center gap-2 bg-transparent px-0 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:border-ring disabled:cursor-not-allowed disabled:opacity-50">
          <span className="sr-only">Search bar</span>
          <FormField name="filterId" render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value as string}>
              <SelectTrigger className="w-max pr-4 bg-muted pl-2 rounded-md border-0 shadow-none flex-row-reverse ">
                <SelectValue placeholder="Select Show" className="w-max" />
              </SelectTrigger>
              <SelectContent>
                {shows.map((show) => (
                  <SelectItem key={show.id} value={show.id.toString()}>
                    <div className="flex gap-1 items-center w-max">
                      <img src={show.iconUrl} alt={`Icon for ${show.title}`} className="w-5 h-5 rounded-full content-center object-cover" />
                      {show.title}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )} />
          <input {...form.register("query", { required: true })} id={id} className="focus-visible:outline-none w-full py-1" placeholder="Search..." type="text" />
        </label>
      </form>
    </Form>
  )
}
