import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

interface FaqItemModel {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItemModel[] = [
  {
    question: 'Czy muszę mieć konto żeby korzystać z generatora menu?',
    answer:
      'Nie — generator menu jest dostępny bez rejestracji. Możesz od razu wybrać zakres dat, rodzaje posiłków i pobrać PDF. Konto przydaje się jeśli chcesz zapisywać własne przepisy i korzystać z nich przy generowaniu.',
  },
  {
    question: 'Skąd pochodzą przepisy w generatorze?',
    answer:
      'Generator korzysta wyłącznie z przepisów dodanych przez Ciebie do biblioteki. Nie ma żadnej zewnętrznej bazy — menu jest układane na podstawie Twoich własnych dań.',
  },
  {
    question: 'Co się stanie jeśli mam za mało przepisów dla wybranego zakresu?',
    answer:
      'Generator poinformuje Cię o braku wystarczającej liczby przepisów przed wygenerowaniem. Możesz wtedy skrócić zakres dat, zmniejszyć liczbę posiłków dziennie lub dodać więcej przepisów do biblioteki.',
  },
  {
    question: 'Czy mogę zmienić przepis po wygenerowaniu menu?',
    answer:
      'Tak — na stronie podsumowania każdy posiłek ma przycisk zamiany. Możesz wybrać inny przepis z biblioteki bez potrzeby ponownego generowania całego menu.',
  },
  {
    question: 'W jakim formacie pobierane jest wygenerowane menu?',
    answer:
      'Menu jest pobierane jako plik PDF gotowy do wydruku lub zapisania na urządzeniu. Każdy dzień jest czytelnie podzielony na posiłki wraz z nazwami przepisów.',
  },
  {
    question: 'Czy mogę udostępniać przepisy innym użytkownikom?',
    answer:
      'Przepisy są prywatne — widoczne tylko dla właściciela konta. Udostępnianie przepisów między kontami nie jest aktualnie obsługiwane.',
  },
];

@Component({
  selector: 'mc-about',
  imports: [RouterLink, AccordionModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly faqItems = FAQ_ITEMS;

  protected readonly values = [
    {
      icon: '🌿',
      title: 'Prostota',
      desc: 'Każda funkcja ma jeden cel. Nie dodajemy nic czego nie potrzebujesz przy codziennym planowaniu.',
    },
    {
      icon: '🔒',
      title: 'Twoje dane, twoje przepisy',
      desc: 'Przepisy które dodajesz są prywatne i widoczne tylko dla Ciebie. Żadnego udostępniania bez zgody.',
    },
    {
      icon: '⚡',
      title: 'Szybkość',
      desc: 'Tygodniowe menu w kilka sekund. Nie wymagamy od Ciebie więcej kliknięć niż absolutne minimum.',
    },
  ];
}
