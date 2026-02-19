import { supabase } from '../lib/supabase';

export default async function Home() {
  
  const { data: scholarships, error } = await supabase
    .from('scholarships')
    .select('*');

  if (error) {
    console.error('Error loading scholarships:', error);
    return <p>Error loading scholarships.</p>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Available Scholarships</h1>
      
      <div className="grid gap-4">
        {scholarships && scholarships.length > 0 ? (
          scholarships.map((s: any) => (
            <div key={s.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-blue-600">{s.title}</h2>
              <p className="text-gray-600 font-medium">{s.provider_name}</p>
              
              <div className="mt-4 flex gap-4 text-sm">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                  ${s.amount_min} - ${s.amount_max}
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Deadline: {new Date(s.deadline).toLocaleDateString()}
                </span>
              </div>
              
              <p className="mt-3 text-gray-700">{s.description}</p>
              
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>No scholarships available.</p>
        )}
      </div>
    </main>
  );
}