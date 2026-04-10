/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Vocabulary {
  word: string;
  reading: string;
  meaning: string;
  level: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  image: string;
  readTime: string;
  content?: string;
  translationLiteral?: string;
  translationNatural?: string;
  vocabulary?: Vocabulary[];
  insight?: string;
}

export type TabType = 'dashboard' | 'translator' | 'courses' | 'insights' | 'glossary' | 'settings';
