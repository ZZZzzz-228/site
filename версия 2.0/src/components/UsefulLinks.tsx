
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UsefulLinks: React.FC = () => {
  const links = [
    {
      title: "Аварийно-диспетчерская служба",
      description: "Телефон горячей линии по вопросам ЖКХ",
      icon: "📞",
      link: "tel:005",
      buttonText: "Позвонить 005"
    },
    {
      title: "Администрация города",
      description: "Официальный сайт администрации Красноярска",
      icon: "🏛️",
      link: "https://www.admkrsk.ru/",
      buttonText: "Перейти"
    },
    {
      title: "Красноярскэнергосбыт",
      description: "Информация об отключениях электроэнергии",
      icon: "⚡",
      link: "https://krsk-sbit.ru/",
      buttonText: "Перейти"
    },
    {
      title: "КрасКом",
      description: "Информация о водоснабжении и теплоснабжении",
      icon: "💧",
      link: "https://kraskom.com/",
      buttonText: "Перейти"
    },
    {
      title: "ГИБДД Красноярска",
      description: "Информация о ДТП и перекрытиях дорог",
      icon: "🚗",
      link: "https://24.gibdd.ru/",
      buttonText: "Перейти"
    },
    {
      title: "Telegram-бот проекта",
      description: "Получайте уведомления в Telegram",
      icon: "📱",
      link: "https://t.me/cityalerts_bot",
      buttonText: "Подписаться"
    }
  ];

  return (
    <Card className="neo-card">
      <CardHeader>
        <CardTitle className="text-xl gradient-text">Полезные ресурсы</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, index) => (
            <Card key={index} className="neo-card bg-blue-900/5 border border-white/10 transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <CardContent className="p-5">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{link.icon}</span>
                    <h3 className="font-medium text-blue-100">{link.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{link.description}</p>
                  <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full bg-muted/50 border-white/10 hover:bg-blue-900/50 hover:border-blue-500/50">
                      <a href={link.link} target="_blank" rel="noopener noreferrer">
                        {link.buttonText}
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsefulLinks;
