import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-center mb-6">Çardak'a Hoş Geldiniz</h1>
      <p className="text-xl text-center mb-10 max-w-2xl">
        Tek platform üzerinde günlük kısa forumlar, özel testler oluşturma ve fotoğraf paylaşımı.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        <FeaturedCard 
          title="Testler" 
          description="Kendi özel testlerinizi oluşturun ve paylaşın. Çoktan seçmeli, görsel tabanlı veya açık uçlu sorular ekleyin."
          link="/testler"
          emoji="🧪"
        />
        <FeaturedCard 
          title="Fotoğraflar" 
          description="Fotoğraflarınızı yükleyin ve diğer kullanıcıların paylaşımlarını görüntüleyin."
          link="/fotograflar"
          emoji="🖼️"
        />
        <FeaturedCard 
          title="Günlük Kısa Forum" 
          description="Günlük konular hakkında kısa yorumlar yapın ve tartışmalara katılın."
          link="/forum"
          emoji="🗨️"
        />
      </div>
    </div>
  );
}

function FeaturedCard({ title, description, link, emoji }: { 
  title: string; 
  description: string; 
  link: string;
  emoji: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-2">{emoji}</span>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <Link
          href={link}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Keşfet
        </Link>
      </div>
    </div>
  );
}
