/**
 * Legal Modals Component
 * Modals for Terms of Service and Privacy Policy
 */

import { createModal } from './modal.js';
import { createElement } from '../utils/dom.js';

/**
 * Open Terms of Service modal
 */
export function openTermsModal() {
  const content = createTermsContent();

  const modal = createModal({
    title: 'Terms of Service',
    content: content,
    size: 'large'
  });

  modal.open();
}

/**
 * Open Privacy Policy modal
 */
export function openPrivacyModal() {
  const content = createPrivacyContent();

  const modal = createModal({
    title: 'Privacy Policy',
    content: content,
    size: 'large'
  });

  modal.open();
}

/**
 * Create Terms of Service content
 */
function createTermsContent() {
  const container = createElement('div', {
    className: 'legal-content'
  });

  const lastUpdated = createElement('p', {
    className: 'legal-updated'
  }, 'Last Updated: January 7, 2026');

  const intro = createElement('p', {
    className: 'legal-intro'
  }, 'Welcome to TaskCraft. By using our service, you agree to these terms. Please read them carefully.');

  container.appendChild(lastUpdated);
  container.appendChild(intro);

  // Sections
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using TaskCraft, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.'
    },
    {
      title: '2. Use of Service',
      content: 'TaskCraft provides AI-powered task management and calendar integration services. You agree to use the service only for lawful purposes and in accordance with these Terms of Service.'
    },
    {
      title: '3. User Accounts',
      content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.'
    },
    {
      title: '4. User Content',
      content: 'You retain all rights to the content you submit to TaskCraft. By submitting content, you grant us a license to use, process, and display that content solely for the purpose of providing our services to you.'
    },
    {
      title: '5. AI Processing',
      content: 'Our AI processes your input to create tasks, events, and reminders. While we strive for accuracy, you acknowledge that AI-generated results may require review and correction.'
    },
    {
      title: '6. Prohibited Activities',
      content: 'You may not use TaskCraft to: (a) violate any laws or regulations; (b) infringe on intellectual property rights; (c) transmit malicious code or spam; (d) attempt to gain unauthorized access to our systems; or (e) interfere with other users\' access to the service.'
    },
    {
      title: '7. Service Availability',
      content: 'We strive to maintain high availability but do not guarantee uninterrupted access to TaskCraft. We may suspend or terminate the service for maintenance, updates, or other necessary purposes.'
    },
    {
      title: '8. Intellectual Property',
      content: 'The TaskCraft platform, including its design, features, and content, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute our intellectual property without permission.'
    },
    {
      title: '9. Limitation of Liability',
      content: 'TaskCraft is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, special, or consequential damages arising from your use of the service.'
    },
    {
      title: '10. Changes to Terms',
      content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use of TaskCraft after changes constitutes acceptance of the modified terms.'
    },
    {
      title: '11. Termination',
      content: 'You may terminate your account at any time through the settings page. We reserve the right to suspend or terminate accounts that violate these terms.'
    },
    {
      title: '12. Governing Law',
      content: 'These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes will be resolved in the appropriate courts.'
    },
    {
      title: '13. Contact Information',
      content: 'If you have questions about these terms, please contact us at legal@taskcraft.com.'
    }
  ];

  sections.forEach(section => {
    const sectionEl = createLegalSection(section.title, section.content);
    container.appendChild(sectionEl);
  });

  return container;
}

/**
 * Create Privacy Policy content
 */
function createPrivacyContent() {
  const container = createElement('div', {
    className: 'legal-content'
  });

  const lastUpdated = createElement('p', {
    className: 'legal-updated'
  }, 'Last Updated: January 7, 2026');

  const intro = createElement('p', {
    className: 'legal-intro'
  }, 'At TaskCraft, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.');

  container.appendChild(lastUpdated);
  container.appendChild(intro);

  // Sections
  const sections = [
    {
      title: '1. Information We Collect',
      content: 'We collect information you provide directly to us, including: account information (name, email, password), task and event data you input, calendar integration details, usage analytics and feedback, and device and browser information.'
    },
    {
      title: '2. How We Use Your Information',
      content: 'We use your information to: provide and improve our services, process your tasks using AI, sync with your calendar, send notifications and reminders, respond to your support requests, analyze usage patterns to enhance features, and comply with legal obligations.'
    },
    {
      title: '3. AI Processing',
      content: 'Your task input is processed by our AI to extract meaningful information such as dates, times, people, and actions. This processing happens securely and your data is not used to train AI models available to other users.'
    },
    {
      title: '4. Data Storage and Security',
      content: 'We use industry-standard encryption (TLS/SSL) to protect data in transit. Data at rest is encrypted using AES-256. We implement access controls, regular security audits, and automated backups. However, no system is completely secure, and we cannot guarantee absolute security.'
    },
    {
      title: '5. Data Sharing',
      content: 'We do not sell your personal information. We may share your data with: service providers who help us operate TaskCraft (under strict confidentiality agreements), calendar services you choose to integrate with, and law enforcement if required by law or to protect our rights.'
    },
    {
      title: '6. Calendar Integration',
      content: 'When you connect your calendar, we request only the permissions necessary to create and modify events. We do not access your entire calendar history unless explicitly required for a feature you enable.'
    },
    {
      title: '7. Cookies and Tracking',
      content: 'We use cookies and similar technologies to: maintain your login session, remember your preferences (theme, settings), analyze usage patterns, and improve performance. You can control cookies through your browser settings.'
    },
    {
      title: '8. Your Rights',
      content: 'You have the right to: access your personal data, correct inaccurate information, delete your account and data, export your data, opt out of marketing communications, and withdraw consent for data processing.'
    },
    {
      title: '9. Data Retention',
      content: 'We retain your data for as long as your account is active. When you delete your account, we permanently delete your personal data within 30 days, except where we are legally required to retain it.'
    },
    {
      title: '10. Children\'s Privacy',
      content: 'TaskCraft is not intended for users under 13 years of age. We do not knowingly collect information from children. If we learn we have collected data from a child, we will delete it immediately.'
    },
    {
      title: '11. International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.'
    },
    {
      title: '12. Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or through the service. Please review this policy periodically.'
    },
    {
      title: '13. Contact Us',
      content: 'If you have questions about this Privacy Policy or how we handle your data, please contact us at privacy@taskcraft.com or through our support channels.'
    }
  ];

  sections.forEach(section => {
    const sectionEl = createLegalSection(section.title, section.content);
    container.appendChild(sectionEl);
  });

  return container;
}

/**
 * Create a legal section
 */
function createLegalSection(title, content) {
  const section = createElement('div', {
    className: 'legal-section'
  });

  const titleEl = createElement('h3', {
    className: 'legal-section-title'
  }, title);

  const contentEl = createElement('p', {
    className: 'legal-section-content'
  }, content);

  section.appendChild(titleEl);
  section.appendChild(contentEl);

  return section;
}
