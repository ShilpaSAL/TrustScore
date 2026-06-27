export default function StatsCards({
  company,
  jobs,
  applications,
}) {
  const cards = [
    {
      value: Math.round(company?.confidenceScore || 0),
      title: "Your Trust Score",
      color: "text-green-400",
    },
    {
      value: jobs.length,
      title: "Active Job Posts",
      color: "text-indigo-500",
    },
    {
      value: applications.length,
      title: "Total Applicants",
      color: "text-amber-400",
    },
    {
      value: company?.complaints_count || 0,
      title: "Complaints Filed",
      color: "text-red-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-10 mt-8">

      {cards.map((card, index) => (

        <div
          key={index}
          className="bg-[#131c2d] border border-[#283247] rounded-2xl h-[115px] px-7 flex flex-col justify-center"
        >

          <h2
            className={`text-5xl font-bold ${card.color}`}
          >
            {card.value}
          </h2>

          <p className="text-[#97A4C2] text-lg mt-2">
            {card.title}
          </p>

        </div>

      ))}

    </div>
  );
}