"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const carrierFormSchema = z.object({
  enabled: z.boolean(),
  environment: z.enum(["test", "production"]),
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  apiKey: z.string().optional(),
  accountNumber: z.string().min(1, "Account number is required"),
  cutoffTime: z.string(),
  pickupEnabled: z.boolean(),
  pickupWindowStart: z.string(),
  pickupWindowEnd: z.string(),
  services: z.array(z.string()),
});

const availableServices: Record<string, { id: string; name: string }[]> = {
  ups: [
    { id: "ground", name: "Ground" },
    { id: "3day", name: "3-Day Select" },
    { id: "2day", name: "2nd Day Air" },
    { id: "nextday", name: "Next Day Air" },
  ],
  fedex: [
    { id: "ground", name: "Ground" },
    { id: "express", name: "Express Saver" },
    { id: "2day", name: "2Day" },
    { id: "priority", name: "Priority Overnight" },
  ],
  usps: [
    { id: "ground", name: "Retail Ground" },
    { id: "priority", name: "Priority Mail" },
    { id: "express", name: "Priority Mail Express" },
  ],
  dhl: [
    { id: "ground", name: "Ground" },
    { id: "express", name: "Express" },
    { id: "sameday", name: "Same Day" },
  ],
};

export default function CarrierSettings() {
  const carriers = [
    {
      id: "ups",
      name: "UPS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1b/UPS_Logo_Shield_2017.svg",
      requiresOAuth: true,
    },
    {
      id: "fedex",
      name: "FedEx",
      logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/FedEx_Logo.svg",
      requiresOAuth: true,
    },
    {
      id: "usps",
      name: "USPS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/USPS_Logo.svg",
      requiresOAuth: false,
    },
    {
      id: "dhl",
      name: "DHL",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/DHL_Logo.svg",
      requiresOAuth: true,
    },
  ];

  const defaultValues = {
    enabled: false,
    environment: "test" as const,
    clientId: "",
    clientSecret: "",
    apiKey: "",
    accountNumber: "",
    cutoffTime: "14:00",
    pickupEnabled: false,
    pickupWindowStart: "09:00",
    pickupWindowEnd: "17:00",
    services: [],
  };

  const form = useForm({
    resolver: zodResolver(carrierFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: z.infer<typeof carrierFormSchema>) => {
    try {
      toast.success("Carrier settings saved successfully");
      console.log(data);
    } catch (error) {
      toast.error("Failed to save carrier settings");
      console.error(error);
    }
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Carrier Settings</h2>
          <p className="text-muted-foreground">
            Configure your shipping carrier accounts and preferences.
          </p>
        </div>

        <Separator />

        {carriers.map((carrier) => (
          <Card key={carrier.id} className="p-6 mb-4">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={carrier.logo}
                alt={`${carrier.name} logo`}
                className="h-8 w-auto"
              />
              <span className="text-lg font-semibold">{carrier.name}</span>
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable {carrier.name}
                        </FormLabel>
                        <FormDescription>
                          Activate {carrier.name} shipping services
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select environment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="test">Test/Sandbox</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose between test and production environments
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {carrier.requiresOAuth && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="clientId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client ID</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter client ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientSecret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Secret</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter client secret"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {!carrier.requiresOAuth && (
                  <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>API Key</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter API key"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter account number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cutoffTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Shipping Cutoff Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="pickupEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Enable Automatic Pickup
                        </FormLabel>
                        <FormDescription>
                          Schedule automatic daily pickups
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {form.watch("pickupEnabled") && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="pickupWindowStart"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Window Start</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pickupWindowEnd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pickup Window End</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="services"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Available Services</FormLabel>
                        <FormDescription>
                          Select which shipping services to enable
                        </FormDescription>
                      </div>
                      <div className="grid gap-2">
                        {availableServices[carrier.id].map((service) => (
                          <FormField
                            key={service.id}
                            control={form.control}
                            name="services"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={service.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(
                                        service.id
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              service.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== service.id
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {service.name}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                <Button type="submit">Save Settings</Button>
              </form>
            </Form>
          </Card>
        ))}
      </div>
    </div>
  );
}