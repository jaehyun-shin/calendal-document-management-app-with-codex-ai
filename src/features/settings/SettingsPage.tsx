import { useAppData } from "../../app/providers/AppDataProvider";
import type { AppSettings } from "../../shared/types/domain";
import {
  calendarViewOptions,
  classificationOptions,
  documentSummaryOptions,
  startScreenOptions,
  statisticsDisplayOptions,
  themeOptions,
} from "./settingsOptions";

type SettingKey = keyof AppSettings;

interface SettingsSelectProps<TName extends SettingKey> {
  label: string;
  name: TName;
  value: AppSettings[TName];
  options: Array<{ value: AppSettings[TName]; label: string }>;
  onChange(settings: Partial<AppSettings>): void;
}

function SettingsSelect<TName extends SettingKey>({
  label,
  name,
  value,
  options,
  onChange,
}: SettingsSelectProps<TName>) {
  return (
    <label className="settings-row">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange({ [name]: event.target.value } as Partial<AppSettings>)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SettingsPage() {
  const { settings, updateSettings } = useAppData();

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">환경 설정</p>
        <h1>설정</h1>
      </header>

      <div className="settings-group">
        <h2>시작</h2>
        <SettingsSelect
          label="시작 화면"
          name="startScreen"
          value={settings.startScreen}
          options={startScreenOptions}
          onChange={updateSettings}
        />
        <SettingsSelect
          label="캘린더 기본 보기"
          name="calendarDefaultView"
          value={settings.calendarDefaultView}
          options={calendarViewOptions}
          onChange={updateSettings}
        />
      </div>

      <div className="settings-group">
        <h2>문서</h2>
        <SettingsSelect
          label="문서 요약 옵션"
          name="documentSummaryMode"
          value={settings.documentSummaryMode}
          options={documentSummaryOptions}
          onChange={updateSettings}
        />
        <SettingsSelect
          label="기본 문서 분류"
          name="classificationMode"
          value={settings.classificationMode}
          options={classificationOptions}
          onChange={updateSettings}
        />
      </div>

      <div className="settings-group">
        <h2>화면</h2>
        <SettingsSelect
          label="통계 표시"
          name="statisticsDisplayMode"
          value={settings.statisticsDisplayMode}
          options={statisticsDisplayOptions}
          onChange={updateSettings}
        />
        <SettingsSelect label="테마" name="theme" value={settings.theme} options={themeOptions} onChange={updateSettings} />
      </div>
    </section>
  );
}
