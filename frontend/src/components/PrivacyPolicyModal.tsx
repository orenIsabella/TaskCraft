import Modal from './Modal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal(props: PrivacyPolicyModalProps) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="Privacy Policy" size="large">
      <div class="modal-content-text">
        <section>
          <h3>1. Information We Collect</h3>
          <p>
            TaskCraft collects information you provide directly to us, including your name, email address,
            and calendar events. We also automatically collect certain information about your device when you
            use our services.
          </p>
        </section>

        <section>
          <h3>2. How We Use Your Information</h3>
          <p>
            We use the information we collect to provide, maintain, and improve our services, to process your
            transactions, to send you technical notices and support messages, and to communicate with you about
            products, services, and events.
          </p>
        </section>

        <section>
          <h3>3. Information Sharing</h3>
          <p>
            We do not share your personal information with third parties except as described in this policy.
            We may share information with vendors and service providers who perform services on our behalf,
            and when required by law or to protect our rights.
          </p>
        </section>

        <section>
          <h3>4. Data Security</h3>
          <p>
            We take reasonable measures to help protect your personal information from loss, theft, misuse,
            unauthorized access, disclosure, alteration, and destruction. However, no security system is
            impenetrable and we cannot guarantee the security of our systems.
          </p>
        </section>

        <section>
          <h3>5. Your Rights</h3>
          <p>
            You have the right to access, update, or delete your personal information at any time. You can
            export your data or delete your account from the Settings page. For additional requests, please
            contact us at privacy@taskcraft.com.
          </p>
        </section>

        <section>
          <h3>6. Cookies and Tracking</h3>
          <p>
            We use cookies and similar tracking technologies to track activity on our service and hold certain
            information. You can instruct your browser to refuse all cookies or to indicate when a cookie is
            being sent.
          </p>
        </section>

        <section>
          <h3>7. Changes to This Policy</h3>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting
            the new privacy policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <p class="text-muted modal-footer-text">
          Last Updated: January 2026
        </p>
      </div>
    </Modal>
  );
}
