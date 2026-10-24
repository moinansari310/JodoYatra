import { InMemoryCampaignRepository } from '@data/repositories/InMemoryCampaignRepository';
import type { CampaignRepository } from '@data/repositories/InMemoryCampaignRepository';
import type { Member, CampaignEvent, Task, TaskStatus, Voter, VoterStatus } from '@domain/models';

export class AppViewModel {
  private listeners = new Set<() => void>();

  constructor(private readonly repository: CampaignRepository = new InMemoryCampaignRepository()) {}

  get members(): Member[] {
    return this.repository.getMembers();
  }
  get voters(): Voter[] {
    return this.repository.getVoters();
  }
  get tasks(): Task[] {
    return this.repository.getTasks();
  }
  get events(): CampaignEvent[] {
    return this.repository.getEvents();
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }
  addMember(member: Member): void {
    this.repository.saveMembers([member, ...this.members]);
    this.notify();
  }
  updateVoterStatus(epicNo: string, status: VoterStatus): void {
    this.repository.saveVoters(
      this.voters.map((voter) => (voter.epicNo === epicNo ? { ...voter, status } : voter)),
    );
    this.notify();
  }
  updateTaskStatus(id: string, status: TaskStatus): void {
    this.repository.saveTasks(
      this.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    );
    this.notify();
  }
  addTask(task: Task): void {
    this.repository.saveTasks([task, ...this.tasks]);
    this.notify();
  }
  addEvent(event: CampaignEvent): void {
    this.repository.saveEvents([event, ...this.events]);
    this.notify();
  }
  rsvpEvent(id: string): void {
    this.repository.saveEvents(
      this.events.map((event) => (event.id === id ? { ...event, rsvp: event.rsvp + 1 } : event)),
    );
    this.notify();
  }
}
