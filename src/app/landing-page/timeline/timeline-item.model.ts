export interface TimelineItem {
    id: number,
    date: number,
    job: string,
    company: string,
    localisation: string,
    type: 'Job' | 'School'
}