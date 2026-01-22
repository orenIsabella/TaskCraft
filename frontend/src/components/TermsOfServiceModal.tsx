import Modal from './Modal';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal(props: TermsOfServiceModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="Terms of Service" size="large">
      <div class="modal-content-text">
        <section>
          <h3>1. Acceptance of Terms</h3>
          <p>
            By accessing and using TaskCraft, you accept and agree to be bound by the terms and provision
            of this agreement. If you do not agree to these terms, please do not use our service.
          </p>
        </section>

        <section>
          <h3>2. Description of Service</h3>
          <p>
            TaskCraft provides a calendar and task management service that helps you organize events and
            reminders. The service includes natural language processing to convert text input into
            structured calendar events.
          </p>
        </section>

        <section>
          <h3>3. User Accounts</h3>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree
            to accept responsibility for all activities that occur under your account. You must notify us
            immediately of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h3>4. Acceptable Use</h3>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that could damage,
            disable, overburden, or impair the service. You may not attempt to gain unauthorized access
            to any part of the service or any other systems or networks connected to the service.
          </p>
        </section>

        <section>
          <h3>5. Content and Intellectual Property</h3>
          <p>
            You retain all rights to the content you submit to TaskCraft. By submitting content, you grant
            us a license to use, store, and process your content solely for the purpose of providing the
            service to you.
          </p>
        </section>

        <section>
          <h3>6. Service Availability</h3>
          <p>
            We strive to provide reliable service, but we do not guarantee that the service will be
            uninterrupted or error-free. We reserve the right to modify or discontinue the service at
            any time without notice.
          </p>
        </section>

        <section>
          <h3>7. Limitation of Liability</h3>
          <p>
            TaskCraft shall not be liable for any indirect, incidental, special, consequential, or punitive
            damages resulting from your use of or inability to use the service. Our total liability shall
            not exceed the amount you paid us in the past twelve months.
          </p>
        </section>

        <section>
          <h3>8. Termination</h3>
          <p>
            We may terminate or suspend your account and access to the service immediately, without prior
            notice, for any reason, including breach of these terms. You may also terminate your account
            at any time from the Settings page.
          </p>
        </section>

        <section>
          <h3>9. Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. We will notify you of any changes by
            posting the new terms on this page. Your continued use of the service after such changes
            constitutes acceptance of the new terms.
          </p>
        </section>

        <p class="text-muted modal-footer-text">
          Last Updated: January 2026
        </p>
      </div>
    </Modal>
  );
}
