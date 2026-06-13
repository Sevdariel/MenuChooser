import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';

type ContactStatus = 'idle' | 'loading' | 'success' | 'error';

interface TopicModel {
  label: string;
  value: string;
}

const TOPICS: TopicModel[] = [
  { label: 'Pytanie ogólne', value: 'general' },
  { label: 'Problem techniczny', value: 'bug' },
  { label: 'Propozycja funkcji', value: 'feature' },
  { label: 'Konto i prywatność', value: 'account' },
  { label: 'Inne', value: 'other' },
];

@Component({
  selector: 'mc-contact',
  imports: [
    FormsModule,
    RouterLink,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  protected readonly topics = TOPICS;

  readonly name = signal('');
  readonly email = signal('');
  readonly topic = signal('');
  readonly message = signal('');
  readonly status = signal<ContactStatus>('idle');
  readonly showErrors = signal(false);

  protected readonly isEmailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email()),
  );

  protected readonly isFormValid = computed(() =>
    this.name().trim() &&
    this.isEmailValid() &&
    this.topic() &&
    this.message().trim(),
  );

  protected async submit(): Promise<void> {
    if (!this.isFormValid()) {
      this.showErrors.set(true);
      return;
    }

    this.status.set('loading');
    this.showErrors.set(false);

    try {
      // tu poleci prawdziwy request
      // await this.contactService.send({ ... });
      await new Promise(r => setTimeout(r, 1200));
      this.status.set('success');
    } catch {
      this.status.set('error');
    }
  }

  protected reset(): void {
    this.name.set('');
    this.email.set('');
    this.topic.set('');
    this.message.set('');
    this.status.set('idle');
    this.showErrors.set(false);
  }
}
