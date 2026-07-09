import { supabase } from "@/lib/supabase";

export default async function PropertiesPage() {
  const { data, error } = await supabase.from("properties").select("*");

  console.log("Properties:", data);
  console.log("Error:", error);

  return (
    <div>
      <h1>Properties</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}