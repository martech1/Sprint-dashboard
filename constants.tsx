
import { ReportData, SprintStatus } from './types';
export const COLORS = {
 MTN_YELLOW: '#FFCC00',
 MTN_BLUE: '#0069B4',
 DONE: '#10b981',
 DELIVERED: '#3b82f6',
 UAT: '#f59e0b',
 DEV: '#8b5cf6',
 IAT: '#ec4899',
 ANALYSIS: '#64748b'
};
export const SCRUM_TEAM = [
 { name: "Omoniyi Martins", role: "SM", fullName: "Scrum Master" },
 { name: "Olubunmi Eshalomi", role: "PO", fullName: "Product Owner" },
 { name: "Olumide Sholana", role: "BA", fullName: "Business Analyst" },
 { name: "Ademola Fafure", role: "TA", fullName: "Test Analyst" },
 { name: "Amara Okonkwo", role: "BTA", fullName: "Business Test Analyst" },
 { name: "Augustine Umeagudosi", role: "TL1", fullName: "Technical Lead 1" },
 { name: "Simeon Obiora", role: "TL2", fullName: "Technical Lead 2" }
];
export const SPRINT_DATA: ReportData = {
 sprint1: {
 metrics: {
 sprintName: "FBB Sprint 1, 2026",
 startDate: "2026-01-23",
 endDate: "2026-02-16",
 averageDeliveryRate: 91
 },
 items: [
 { id: 1, summary: "Sunset of 200GB Broadband Bundle", issueKey: "FBT-1356", status: SprintStatus.DONE, goLiveDate: "2/27/2026" },
 { id: 2, summary: "USSD Fibre re-arrangement", issueKey: "FBT-1316", status: SprintStatus.DONE, goLiveDate: "2/20/2026" },
 { id: 3, summary: "50Mbps FibreX Price Review", issueKey: "FBT-1313", status: SprintStatus.DONE, goLiveDate: "2/23/2026" },
 { id: 4, summary: "Activation of Unlimited data plan on 5G ODUs", issueKey: "FBT-1307", status: SprintStatus.DELIVERED },
 { id: 5, summary: "Make Service Class 191 Eligible for 5G Speed-based plan", issueKey: "FBT-1301", status: SprintStatus.DELIVERED },
 { id: 6, summary: "Offline NIMC Downtime:", issueKey: "FBT-1272", status: SprintStatus.DONE, goLiveDate: "2/25/2026" },
 { id: 7, summary: "Geo-Locking Solution for 4G and 5G Fixed Wireless Access (FWA)", issueKey: "FBT-1217", status: SprintStatus.DONE, goLiveDate: "TBD" },
 { id: 8, summary: "Partial Decomissioning of FibreX 20Mbps Plan", issueKey: "FBT-1117", status: SprintStatus.DONE, goLiveDate: "2/20/2026" },
 { id: 9, summary: "BOGOF FTTH promo for 50/100/300Mbps Only", issueKey: "FBT-870", status: SprintStatus.UAT, goLiveDate: "2/27/2026" },
 { id: 10, summary: "50Mbps FibreX Price Review", issueKey: "FBT-1385", status: SprintStatus.DONE, goLiveDate: "2/23/2026" },
 ]
 },
 sprint2: {
 metrics: {
 sprintName: "FBB Sprint 2, 2026",
 startDate: "2026-02-19",
 endDate: "2026-03-12",
 averageDeliveryRate: 0
 },
 items: [
 { id: 11, summary: "Introduction of New 200Mbps FibreX Plan", issueKey: "FBT-1314", status: SprintStatus.DEV_CONFIG },
 { id: 12, summary: "4G Speed-based Broadband Bundle", issueKey: "FBT-1310", status: SprintStatus.DEV_CONFIG },
 { id: 13, summary: "Agents Ability to deactivate bundles on DCLM", issueKey: "FBT-1309", status: SprintStatus.DEV_CONFIG },
 { id: 14, summary: "Unlimited Plans - Alignment of subscription layout & plan details across all channels", issueKey: "FBT-1308", status: SprintStatus.ANALYSIS },
 { id: 15, summary: "Re-integration of 20Mbps Acquisition Offer for New FibreX Customers on DCLM", issueKey: "FBT-1243", status: SprintStatus.IAT },
 { id: 16, summary: "Auto-Attach Offer ID for 'Try it Like it Subscribe' FTTH Sales", issueKey: "FBT-1214", status: SprintStatus.IAT },
 ]
 },
 deprioritized: [
 { id: 101, summary: "Display of 5Gspeed-based bundles and validity on MyMTN App", issueKey: "FBT-1306", status: "Dev/Config" }
 ]
};
