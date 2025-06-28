"use client";

import { useBrands } from "@/hooks/useBrands";
import useCpus from "@/hooks/useCpus";
import {
  Checkbox,
  CheckboxOptionType,
  Collapse,
  CollapseProps,
  Skeleton,
} from "antd";
import { useEffect, useState } from "react";

export interface ClientProductFilterProps {
  onFilterChange: (filters: Record<string, string[]>) => void;
}

export function ClientProductFilter({
  onFilterChange,
}: ClientProductFilterProps) {
  const { data: brands, isLoading } = useBrands();
  const { data: cpus } = useCpus();
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const uniqueCpuBrands = Array.from(
    new Set(cpus?.map((cpu: { brand: string }) => cpu.brand))
  );

  const uniqueCoreSeriesNames = Array.from(
    new Set(cpus?.map((cpu: { series: string }) => cpu.series))
  );

  const brandOptions: CheckboxOptionType<string>[] = brands?.map(
    (brand: { id: string; name: string }) => ({
      label: brand.name,
      value: brand.name,
      className: `label-${brand.id}`,
    })
  );

  const cpuBrandOptions: CheckboxOptionType<string>[] = uniqueCpuBrands
    .filter((brand): brand is string => typeof brand === "string")
    .map((brand) => ({
      label: brand,
      value: brand,
      className: `label-${brand.toLowerCase()}`,
    }));

  const cpuCoreSeriesOptions: CheckboxOptionType<string>[] =
    uniqueCoreSeriesNames
      .filter((series): series is string => typeof series === "string")
      .map((series) => ({
        label: series,
        value: series,
        className: `label-${series.toLowerCase()}`,
      }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onCheckBoxChange = (filterKey: string) => (checkedValues: any[]) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (checkedValues.length > 0)
        newFilters[filterKey] = checkedValues as string[];
      else delete newFilters[filterKey];

      return newFilters;
    });
  };

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <h4 className="font-bold text-white">Brand</h4>,
      children: (
        <Checkbox.Group
          options={brandOptions}
          onChange={onCheckBoxChange("laptopbrand")}
          className="!ml-2 !flex-col gap-4"
        />
      ),
    },
    {
      key: "2",
      label: <h4 className="font-bold text-white">Cpu brand</h4>,
      children: (
        <Checkbox.Group
          options={cpuBrandOptions}
          onChange={onCheckBoxChange("cpu_brand")}
          className="!ml-2 !flex-col gap-4"
        />
      ),
    },
    {
      key: "3",
      label: <h4 className="font-bold text-white">Series</h4>,
      children: (
        <Checkbox.Group
          options={cpuCoreSeriesOptions}
          onChange={onCheckBoxChange("cpu_series")}
          className="!ml-2 !flex-col gap-4"
        />
      ),
    },
  ];

  const onChange = (key: string | string[]) => {
    console.log(key);
  };

  if (isLoading) return <Skeleton />;

  return (
    <Collapse
      items={items}
      defaultActiveKey={["1"]}
      onChange={onChange}
      bordered={false}
      className="!w-full !bg-transparent"
      size="large"
    />
  );
}
