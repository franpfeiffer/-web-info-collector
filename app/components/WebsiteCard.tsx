import { useState } from 'react'

export default function WebsiteCard({ website }) {
  const [expandedNews, setExpandedNews] = useState<number | null>(null);

  const toggleNewsExpansion = (index: number) => {
    setExpandedNews(expandedNews === index ? null : index);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{website.title || 'Sin título'}</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{website.description || 'Sin descripción'}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Noticias</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {website.news && website.news.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {website.news.map((item, index) => (
                    <li key={index} className="py-4">
                      <h4 className="font-medium cursor-pointer" onClick={() => toggleNewsExpansion(index)}>
                        {item.title}
                      </h4>
                      {expandedNews === index && (
                        <div className="mt-2">
                          <p>{item.excerpt}</p>
                          {item.link && (
                            <a 
                              href={item.link.startsWith('http') ? item.link : `${website.url}${item.link}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-indigo-600 hover:text-indigo-900 mt-2 inline-block"
                            >
                              Leer más
                            </a>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div>
                  <p className="font-medium">No se encontraron noticias en este sitio</p>
                  <p className="mt-2">{website.siteDescription}</p>
                </div>
              )}
            </dd>
          </div>
          <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">URL</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                Visitar sitio
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
