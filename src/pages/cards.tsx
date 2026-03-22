import CardFront from "@/components/CardFront";
import { tarot_cards as cards } from "@/data.json";

export default function CardsPage() {
  return (
    <div className="min-h-screen bg-black p-6">
      <h1 className="mb-6 text-center text-2xl font-medium text-orange-200">
        Toutes les cartes
      </h1>
      <div className="mx-auto grid max-w-6xl grid-cols-3 place-items-center gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {cards.map((card) => (
          <CardFront key={card.id} data={card as any} />
        ))}
      </div>
    </div>
  );
}
