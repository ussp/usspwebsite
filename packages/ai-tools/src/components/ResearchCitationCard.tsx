interface ResearchCitationCardProps {
  source: string;
  finding: string;
  year: number;
}

export default function ResearchCitationCard({
  source,
  finding,
  year,
}: ResearchCitationCardProps) {
  return (
    <div className="bg-white rounded-lg border border-light-gray p-4">
      <p className="text-sm font-medium text-dark mb-1">{source}</p>
      <p className="text-sm text-primary font-semibold">{finding}</p>
      <p className="text-xs text-dark/40 mt-1">{year}</p>
    </div>
  );
}
