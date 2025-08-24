"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { packageDetailsSchema } from "@/lib/validations/shipping";
import { type ShippingDetails } from "@/lib/types/shipping";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import PackingCostSummary from "./packing-cost-summary";

const packagingMaterials = [
  { id: "bubble-wrap", label: "Bubble Wrap" },
  { id: "packing-peanuts", label: "Packing Peanuts" },
  { id: "foam", label: "Foam Padding" },
  { id: "tape", label: "Packing Tape" },
  { id: "corner-protectors", label: "Corner Protectors" },
];

interface PackageDetailsProps {
  onCalculate: (details: ShippingDetails) => void;
}

export default function PackageDetails({ onCalculate }: PackageDetailsProps) {
  const form = useForm<ShippingDetails>({
    resolver: zodResolver(packageDetailsSchema),
    defaultValues: {
      shipper: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      receiver: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
      },
      package: {
        length: "",
        width: "",
        height: "",
        weight: "",
      },
      packing: {
        type: "customer",
        materials: [],
      },
    },
  });

  const packingDetails = form.watch("packing");

  const onSubmit = (data: ShippingDetails) => {
    // Keep the data as strings since that's what the interface expects
    onCalculate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
        {/* Shipper Address section remains the same */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipper Address</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="shipper.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipper.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipper.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipper.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Receiver Address section remains the same */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Receiver Address</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="receiver.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input placeholder="456 Oak Ave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiver.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiver.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="receiver.zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ZIP Code</FormLabel>
                  <FormControl>
                    <Input placeholder="67890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Packing Options section with cost summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Packing Options</h3>
          <FormField
            control={form.control}
            name="packing.type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>How would you like your item packed?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="customer" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        I'll pack it myself
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="shipping-center" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Pack at shipping center
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {packingDetails.type === "shipping-center" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="packing.boxSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Box Size</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a box size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="small">
                          Small (12" x 12" x 12")
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium (18" x 18" x 18")
                        </SelectItem>
                        <SelectItem value="large">
                          Large (24" x 24" x 24")
                        </SelectItem>
                        <SelectItem value="custom">Custom Size</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the box size that best fits your item
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packing.packagingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packaging Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select packaging type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="box">Cardboard Box</SelectItem>
                        <SelectItem value="bubble-mailer">
                          Bubble Mailer
                        </SelectItem>
                        <SelectItem value="envelope">
                          Shipping Envelope
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packing.materials"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Additional Packing Materials</FormLabel>
                      <FormDescription>
                        Select any additional materials needed to protect your item
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {packagingMaterials.map((material) => (
                        <FormField
                          key={material.id}
                          control={form.control}
                          name="packing.materials"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={material.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(material.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            material.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== material.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {material.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packing.complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packaging Complexity</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular Packaging</SelectItem>
                        <SelectItem value="fragile">Fragile Items</SelectItem>
                        <SelectItem value="veryFragile">Very Fragile Items</SelectItem>
                        <SelectItem value="custom">Custom Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <PackingCostSummary packingDetails={packingDetails} />
            </div>
          )}
        </div>

        <Separator />

        {/* Package Dimensions section remains the same */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Package Dimensions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="package.length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Length (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package.width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Width (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package.height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (inches)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="package.weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (lbs)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="0.0"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Calculate Shipping Options
        </Button>
      </form>
    </Form>
  );
}