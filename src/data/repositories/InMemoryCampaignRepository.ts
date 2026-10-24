import {
  events as seedEvents,
  members as seedMembers,
  tasks as seedTasks,
  voters as seedVoters,
} from '../mockData';
import type { CampaignEvent, Member, Task, Voter } from '../mockData';

export interface CampaignRepository {
  getMembers(): Member[];
  getVoters(): Voter[];
  getTasks(): Task[];
  getEvents(): CampaignEvent[];
  saveMembers(members: Member[]): void;
  saveVoters(voters: Voter[]): void;
  saveTasks(tasks: Task[]): void;
  saveEvents(events: CampaignEvent[]): void;
}

export class InMemoryCampaignRepository implements CampaignRepository {
  private members = [...seedMembers];
  private voters = [...seedVoters];
  private tasks = [...seedTasks];
  private events = [...seedEvents];

  getMembers(): Member[] {
    return this.members;
  }
  getVoters(): Voter[] {
    return this.voters;
  }
  getTasks(): Task[] {
    return this.tasks;
  }
  getEvents(): CampaignEvent[] {
    return this.events;
  }
  saveMembers(members: Member[]): void {
    this.members = members;
  }
  saveVoters(voters: Voter[]): void {
    this.voters = voters;
  }
  saveTasks(tasks: Task[]): void {
    this.tasks = tasks;
  }
  saveEvents(events: CampaignEvent[]): void {
    this.events = events;
  }
}
