import { useRef, useState } from 'react';
import { Banner } from '@astryxdesign/core/Banner';
import { Button } from '@astryxdesign/core/Button';
import { Heading } from '@astryxdesign/core/Heading';
import { Icon } from '@astryxdesign/core/Icon';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Text } from '@astryxdesign/core/Text';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '../components/icons';
import { TopBar } from '../components/ui';
import { exportState, importState, resetState, setTheme, useAppState, type ThemeMode } from '../lib/store';

export function Settings() {
  const state = useAppState();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ status: 'success' | 'error'; text: string } | null>(null);

  const download = () => {
    const blob = new Blob([exportState()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algoplus-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ status: 'success', text: 'Backup saved' });
  };

  const upload = async (file: File) => {
    try {
      importState(await file.text());
      setMessage({ status: 'success', text: 'Progress restored from backup' });
    } catch (e) {
      setMessage({ status: 'error', text: e instanceof Error ? e.message : 'Could not read that file.' });
    }
  };

  const answered = Object.keys(state.cards).length;

  return (
    <main className="screen">
      <TopBar title="Settings" />

      {message && <Banner status={message.status} title={message.text} />}

      <section className="stack-3">
        <Heading level={2}>Appearance</Heading>
        <SegmentedControl label="Theme" value={state.theme} onChange={(v) => setTheme(v as ThemeMode)} layout="fill" size="lg">
          <SegmentedControlItem value="system" label="System" />
          <SegmentedControlItem value="light" label="Light" />
          <SegmentedControlItem value="dark" label="Dark" />
        </SegmentedControl>
      </section>

      <section className="stack-3">
        <div className="stack-1">
          <Heading level={2}>Your progress</Heading>
          <Text type="body" color="secondary">
            Stored only on this device. {answered} {answered === 1 ? 'card' : 'cards'} reviewed so far.
          </Text>
        </div>
        <div className="row" style={{ gap: 'var(--spacing-2)' }}>
          <Button label="Export backup" variant="secondary" size="lg" width="100%" icon={<Icon icon={ArrowDownTrayIcon} size="sm" />} onClick={download} />
          <Button label="Import backup" variant="secondary" size="lg" width="100%" icon={<Icon icon={ArrowUpTrayIcon} size="sm" />} onClick={() => fileRef.current?.click()} />
        </div>
        <input
          ref={fileRef}
          className="file-input"
          type="file"
          accept="application/json,.json"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = '';
          }}
        />
      </section>

      <section className="stack-3">
        <Heading level={2}>Start over</Heading>
        <Button
          label="Reset progress"
          variant="destructive"
          size="lg"
          onClick={() => {
            if (window.confirm('Reset progress? This clears every review, mistake and lesson position on this device.')) {
              resetState();
              setMessage({ status: 'success', text: 'Progress reset' });
            }
          }}
        />
      </section>
    </main>
  );
}
