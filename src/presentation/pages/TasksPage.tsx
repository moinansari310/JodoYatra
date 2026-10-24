import { useState } from 'react';
import { Check, MapPin, Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { colors, common } from '@presentation/theme';
import { styles } from '@presentation/styles/AppStyles';
import { translate as t } from '@presentation/i18n';
import type { Language } from '@presentation/types/navigation';
import { appModel as model } from '@presentation/state/appModel';
import type { CampaignEvent, Task } from '@domain/models';

export function TasksView({ language }: { language: Language }) {
  const [tab, setTab] = useState<'tasks' | 'events'>('tasks');
  return (
    <>
      <View style={common.header}>
        <Text style={common.title}>{t('Tasks & Events', 'कार्य और कार्यक्रम', language)}</Text>
        <Pressable style={styles.addButton}>
          <Plus size={16} color="#fff" />
          <Text style={common.buttonText}>{t('New', 'नया', language)}</Text>
        </Pressable>
      </View>
      <View style={styles.segment}>
        <Pressable
          style={[styles.segmentButton, tab === 'tasks' && styles.segmentActive]}
          onPress={() => setTab('tasks')}
        >
          <Text>My Tasks</Text>
        </Pressable>
        <Pressable
          style={[styles.segmentButton, tab === 'events' && styles.segmentActive]}
          onPress={() => setTab('events')}
        >
          <Text>Events</Text>
        </Pressable>
      </View>
      {tab === 'tasks'
        ? model.tasks.map((task) => <TaskCard task={task} language={language} key={task.id} />)
        : model.events.map((event) => (
            <EventCard event={event} language={language} key={event.id} />
          ))}
    </>
  );
}

export default TasksView;
function TaskCard({ task, language: _language }: { task: Task; language: Language }) {
  const done = task.status === 'done';
  return (
    <View style={[styles.taskCard, task.status === 'in_progress' && styles.activeBorder]}>
      <Pressable onPress={() => model.updateTaskStatus(task.id, done ? 'pending' : 'done')}>
        <Check size={20} color={done ? colors.accent : colors.mutedFg} />
      </Pressable>
      <View style={styles.flex}>
        <Text style={[styles.cardTitle, done && styles.strike]}>{task.title}</Text>
        <Text style={styles.muted}>
          <MapPin size={10} /> {task.dueDate.slice(8)} Sep
        </Text>
      </View>
      {!done && (
        <Pressable
          onPress={() =>
            model.updateTaskStatus(
              task.id,
              task.status === 'in_progress' ? 'pending' : 'in_progress',
            )
          }
          style={styles.smallTag}
        >
          <Text style={styles.accentText}>
            {task.status === 'in_progress' ? 'Active' : 'Start'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
function EventCard({ event, language }: { event: CampaignEvent; language: Language }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.dateBox}>
        <Text style={styles.dateMonth}>SEP</Text>
        <Text style={styles.dateDay}>{event.date.slice(8)}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.cardTitle}>{language === 'hi' ? event.titleHi : event.title}</Text>
        <Text style={styles.muted}>
          {event.location} · {event.time}
        </Text>
        <Text style={styles.accentText}>{event.rsvp} RSVP</Text>
      </View>
    </View>
  );
}
