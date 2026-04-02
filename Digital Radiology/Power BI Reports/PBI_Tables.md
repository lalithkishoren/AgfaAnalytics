# Power BI Tables Schema
**Generated:** March 2026  
**Scope:** Digital Radiology — Dashboards1, Dashboards2, Dashboards3

---

## Contents

- [Commercial Analytics - OIT Margin & Product Mix 2026](#commercial-analytics--oit-margin-product-mix-2026) — Dashboards1
- [Partner Dashboard](#partner-dashboard) — Dashboards2
- [Commercial Analytics - Weekly FC Tracker](#commercial-analytics--weekly-fc-tracker) — Dashboards2
- [Price Margin Modalities](#price-margin-modalities) — Dashboards2
- [Commercial Analytics - Funnel Evolution Tracker](#commercial-analytics--funnel-evolution-tracker) — Dashboards3
- [Commercial Analytics - OI & Funnel Health Cockpit](#commercial-analytics--oi-funnel-health-cockpit) — Dashboards3

---

## Commercial Analytics - OIT Margin & Product Mix 2026
**Folder:** Dashboards1  
**Tables:** 14

### Budget Quarter

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Year | Text | 1 | No |
| Quarter | Text | 4 | No |
| YearQuarter | Text | 4 | No |

### MSD Quarter

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Year | Text | 19 | Yes |
| Quarter | Text | 4 | Yes |
| YearQuarter | Text | 71 | Yes |

### New Cluster/ Region Table

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| COUNTRIES | Text | 41 | No |
| REGION | Text | 3 | No |
| CLUSTER | Text | 10 | No |
| AREA | Text | 33 | No |

### Quarter Slicer

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Year | Text | 19 | No |
| Quarter | Text | 4 | No |
| YearQuarter | Text | 71 | No |
| Quarter_Index | Text | 4 | No |

### Region/ Cluster Slicer

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| IMG SubReg | Text | 38 | No |
| AREA | Text | 32 | No |
| REGION | Text | 3 | No |
| CLUSTER | Text | 10 | No |

### Topic map

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Topic | Text | 25,812 | No |
| Equipment type | Text | 9 | No |
| AREA | Text | 32 | Yes |
| REGION | Text | 3 | Yes |
| CLUSTER | Text | 10 | Yes |
| IMG SubReg | Text | 38 | Yes |
| agfa_wasquotedcreatedname | Text | 2 | No |
| agfa_maintypecodename | Text | 3 | Yes |
| FC category sort | Whole Number | 9 | No |
| IMG SubReg_1 | Text | 38 | Yes |
| agfa_weightedamountexcludingsma_base | Decimal Number | 12,883 | Yes |
| destination | Text | 136 | Yes |

### account

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| cr57c_name | Text | 72,846 | No |
| cr57c_accountid | Text | 76,481 | No |
| cr57c_address2_city | Text | 24,385 | Yes |
| cr57c_address2_country | Text | 194 | Yes |
| cr57c_address1_postalcode | Text | 36,135 | Yes |
| cr57c_agfa_saprecordid | Text | 46,315 | Yes |

### mapping

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Destination | Text | 271 | No |
| IMG SubReg | Text | 43 | No |
| IMG RegGrp | Text | 4 | No |
| Report Region | Text | 23 | No |
| Fixed Destination | Text | 237 | No |
| Check | Whole Number | 1 | No |
| Column7 | Text | 1 | Yes |

### msd data

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| opportunityid | Text | 28,902 | No |
| createdon | Date | 26,646 | No |
| owneridname | Text | 282 | No |
| Topic | Text | 25,812 | No |
| actualclosedate | Date | 4,129 | Yes |
| actualvalue_base | Decimal Number | 15,132 | Yes |
| estimatedclosedate | Date | 4,395 | Yes |
| estimatedvalue_base | Decimal Number | 16,851 | Yes |
| statecodename | Text | 2 | No |
| statuscodename | Text | 4 | No |
| stepname | Text | 6 | Yes |
| accountid | Text | 5,570 | Yes |
| accountidname | Text | 5,535 | Yes |
| msdyn_forecastcategoryname | Text | 8 | Yes |
| agfa_opportunityid | Text | 28,902 | No |
| agfa_businessunitcodename | Text | 1 | No |
| agfa_installatid | Text | 831 | Yes |
| agfa_quoteid | Text | 27,493 | Yes |
| agfa_requesteddeliverydate | Date | 5,892 | Yes |
| agfa_quotetypename | Text | 2 | Yes |
| agfa_quotestatusname | Text | 8 | Yes |
| agfa_estordervalueexcludingsmaamount_base | Decimal Number | 17,161 | Yes |
| agfa_saporderid | Text | 1,648 | Yes |
| agfa_actualrevenueexcludingsmaamount_base | Decimal Number | 15,455 | Yes |
| createdbyname | Text | 136 | No |
| agfa_plannedrevenuerecognitiondate | Date | 1,189 | Yes |
| agfa_margincostpercentagetotal | Decimal Number | 1,715 | Yes |
| IMG SubReg_1 | Text | 38 | Yes |
| IMG RegGrp | Text | 3 | Yes |
| Year | Text | 19 | Yes |
| Quarter | Text | 4 | Yes |
| YearQuarter | Text | 71 | Yes |
| Sofon Product Family Id | Whole Number | 33 | Yes |
| agfa_margincostpercentage | Decimal Number | 2,116 | Yes |
| Equipment type | Text | 9 | No |
| AREA | Text | 32 | Yes |
| REGION | Text | 3 | Yes |
| CLUSTER | Text | 10 | Yes |
| productname | Text | 205 | Yes |
| agfa_margincostpercentagehardware | Decimal Number | 1,681 | Yes |
| agfa_margincostpercentageimplementation | Decimal Number | 402 | Yes |
| agfa_margincostpercentageinternallicenses | Decimal Number | 261 | Yes |
| agfa_margincostpercentageservicecontracts | Decimal Number | 545 | Yes |
| agfa_opportunitymarginpercentageexcludingsma | Decimal Number | 1,728 | Yes |
| Year_Est | Text | 19 | Yes |
| Year_Actual | Text | 15 | Yes |
| Quarter_Est | Text | 4 | Yes |
| Quarter_Actual | Text | 4 | Yes |
| quantity_final | Whole Number | 71 | No |
| agfa_feasibilitycode | Whole Number | 6 | No |
| agfa_wasquotedcreatedname | Text | 2 | No |
| agfa_maintypecodename | Text | 3 | Yes |
| FC category sort | Whole Number | 9 | No |
| IMG SubReg | Text | 38 | Yes |
| agfa_weightedamountexcludingsma_base | Decimal Number | 12,883 | Yes |
| agfa_quantitysofon | Whole Number | 118 | Yes |
| destination | Text | 136 | Yes |

### msd data sub-region

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| IMG SubReg | Text | 38 | Yes |
| AREA | Text | 32 | Yes |
| REGION | Text | 3 | Yes |
| CLUSTER | Text | 10 | Yes |

### opportunity

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| opportunityid | Text | 46,523 | No |
| createdon | Date | 37,516 | No |
| owneridname | Text | 395 | No |
| name | Text | 40,434 | Yes |
| actualclosedate | Date | 4,273 | Yes |
| actualvalue | Decimal Number | 15,447 | Yes |
| actualvalue_base | Decimal Number | 15,815 | Yes |
| estimatedclosedate | Date | 4,944 | Yes |
| estimatedvalue | Decimal Number | 20,432 | Yes |
| estimatedvalue_base | Decimal Number | 21,905 | Yes |
| statecodename | Text | 3 | No |
| statuscodename | Text | 19 | No |
| stepname | Text | 11 | Yes |
| accountid | Text | 13,163 | Yes |
| accountidname | Text | 13,082 | Yes |
| msdyn_forecastcategoryname | Text | 12 | Yes |
| agfa_dhdealhappencodename | Whole Number | 4 | No |
| agfa_dsdealsigncodename | Whole Number | 4 | No |
| agfa_opportunityid | Text | 46,522 | Yes |
| agfa_businessunitcodename | Text | 4 | No |
| agfa_feasibilitycode | Whole Number | 6 | Yes |
| agfa_installatid | Text | 2,207 | Yes |
| agfa_quoteid | Text | 32,746 | Yes |
| agfa_requesteddeliverydate | Date | 7,333 | Yes |
| agfa_salesoneopportunityid | Text | 28,647 | Yes |
| agfa_salesorganizationcode | Text | 71 | Yes |
| agfa_quotetypename | Text | 2 | Yes |
| agfa_quotestatusname | Text | 8 | Yes |
| agfa_weightedamount | Decimal Number | 20,021 | Yes |
| agfa_weightedamount_base | Decimal Number | 20,426 | Yes |
| agfa_estordervalueexcludingsmaamount | Decimal Number | 19,845 | Yes |
| agfa_estordervalueexcludingsmaamount_base | Decimal Number | 20,536 | Yes |
| agfa_saporderid | Text | 1,694 | Yes |
| agfa_weightedamountexcludingsma | Decimal Number | 15,642 | Yes |
| agfa_weightedamountexcludingsma_base | Decimal Number | 16,054 | Yes |
| agfa_actualrevenueexcludingsmaamount | Decimal Number | 15,565 | Yes |
| agfa_actualrevenueexcludingsmaamount_base | Decimal Number | 15,569 | Yes |
| createdbyname | Text | 251 | No |
| agfa_plannedrevenuerecognitiondate | Date | 1,471 | Yes |
| agfa_margincostpercentagetotal | Decimal Number | 2,665 | Yes |
| agfa_margincostpercentagehardware | Decimal Number | 2,677 | Yes |
| agfa_margincostpercentageimplementation | Decimal Number | 705 | Yes |
| agfa_margincostpercentageinternallicenses | Decimal Number | 382 | Yes |
| agfa_margincostpercentageservicecontracts | Decimal Number | 931 | Yes |
| agfa_opportunitymarginpercentageexcludingsma | Decimal Number | 2,689 | Yes |
| agfa_wasquotedcreatedname | Text | 2 | Yes |
| agfa_maintypecodename | Text | 4 | Yes |
| agfa_accountcountryidname | Text | 151 | Yes |

### opportunityproduct

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| opportunityproductid | Text | 135,177 | No |
| extendedamount | Decimal Number | 83,636 | No |
| extendedamount_base | Decimal Number | 84,373 | No |
| opportunityid | Text | 40,456 | No |
| productid | Text | 419 | Yes |
| agfa_budgetclass | Text | 25 | Yes |
| agfa_businessunitcodename | Text | 3 | Yes |
| agfa_divisioncodename | Text | 2 | Yes |
| productname | Text | 868 | Yes |
| quantity | Whole Number | 464 | No |
| agfa_sofonproductfamilyid | Whole Number | 42 | Yes |
| agfa_margincostpercentage | Decimal Number | 23,541 | Yes |
| agfa_quantitysofon | Whole Number | 312 | Yes |

### raw data

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Config Lev 1 | Text | 8 | No |
| Config Lev 2 | Text | 34 | No |
| Config Lev 3 | Text | 7 | No |
| UOM | Text | 4 | No |
| Art Descrip | Text | 447 | No |
| BU | Text | 1 | No |
| Rate | Decimal Number | 6 | No |
| Currency | Text | 6 | No |
| Sales Manager | Text | 8 | No |
| Channel | Text | 5 | No |
| Region | Text | 44 | No |
| Month | Text | 12 | No |
| Period | Text | 1 | No |
| OI/Sales | Text | 1 | No |
| QTY Config | Whole Number | 20 | No |
| QTY.1 | Whole Number | 69 | Yes |
| Value Config | Whole Number | 327 | No |
| Value.1 | Decimal Number | 7,076 | Yes |
| LSP Config | Whole Number | 303 | No |
| LSP.1 | Decimal Number | 1,472 | Yes |
| Min Price Config | Whole Number | 239 | No |
| Min Price | Decimal Number | 718 | No |
| Value (EUR) | Decimal Number | 7,080 | Yes |
| LSP (EUR) | Decimal Number | 991 | Yes |
| Value Config (EUR) | Whole Number | 346 | No |
| LSP Config (EUR) | Whole Number | 296 | No |
| Min Price Config (EUR) | Whole Number | 233 | No |
| Min Price (EUR) | Decimal Number | 278 | No |
| HE REG LEVEL 1 | Text | 4 | No |
| HE REG LEVEL 2 | Text | 5 | No |
| HE REG LEVEL 3 | Text | 12 | No |
| HE REG LEVEL 4 | Text | 29 | No |
| HE REG LEVEL 5 | Text | 44 | No |
| HE REG LEVEL 5 CODE | Text | 44 | No |
| Equipment Type | Text | 9 | No |
| IMG RegGrp | Text | 3 | No |
| Year | Text | 1 | No |
| Quarter | Text | 4 | No |
| YearQuarter | Text | 4 | No |
| IMG SubReg | Text | 33 | No |
| PF.1 | Text | 71 | No |
| PF | Text | 20 | No |
| REGION.1 | Text | 3 | No |
| CLUSTER | Text | 10 | No |
| AREA | Text | 30 | No |

### raw data sub-region

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| IMG SubReg | Text | 33 | No |
| REGION | Text | 3 | No |
| CLUSTER | Text | 10 | No |
| AREA | Text | 30 | No |

### Relationships

| From Table | From Column | To Table | To Column | Cardinality | Active |
|---|---|---|---|---|---|
| msd data | YearQuarter | Quarter Slicer | YearQuarter | M:1 | ✓ |
| raw data | IMG SubReg | Region/ Cluster Slicer | IMG SubReg | M:1 | ✓ |
| raw data | YearQuarter | Quarter Slicer | YearQuarter | M:1 | ✓ |
| raw data | Equipment Type | *(removed table)* | — | M:1 | ✓ |
| Topic map | Topic | msd data | Topic | M:M | ✓ |
| Topic map | Equipment type | *(removed table)* | — | M:1 | ✓ |
| Topic map | IMG SubReg | Region/ Cluster Slicer | IMG SubReg | M:1 | ✓ |
| Topic map | IMG SubReg | raw data sub-region | IMG SubReg | M:1 | ✓ |
| msd data | IMG SubReg | Region/ Cluster Slicer | IMG SubReg | M:1 | ✗ (inactive) |
| msd data | IMG SubReg | raw data sub-region | IMG SubReg | M:1 | ✗ (inactive) |
| Topic map | destination | mapping | Destination | M:1 | ✗ (inactive) |

---

## Partner Dashboard
**Folder:** Dashboards2  
**Tables:** 9

### AP2 customers

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Bill-to party | Text | 603 | No |
| Bill-to Party Name | Text | 588 | No |
| Bill-to Country | Text | 20 | No |
| Bill-to Customer Updated in APX | Text | 2 | Yes |
| sap channel | Text | 2 | No |
| sap channel name | Text | 2 | No |

### BudgetClassGroup xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Budget Class | Text | 16 | No |
| Budget Class Group | Text | 3 | No |

### DealerList xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Dealer Market | Text | 5 | Yes |
| Dealer Name | Text | 723 | Yes |
| Dealer SAP ID | Text | 754 | No |
| SAP ID (TEXT) | Text | 754 | No |
| September 2023 updated in APX | Text | 2 | No |
| Channel Manager ID | Text | 10 | Yes |
| Channel Manager Name | Text | 10 | Yes |
| Dealer Type | Type 1 | 1 | No |
| SAP channel | Text | 5 | No |
| SAP channel name | Text | 5 | No |
| sales last 2yr | Text | 2 | No |

### DealerList_TargetSetting xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Dealer Market | Text | 5 | No |
| Country | Text | 81 | No |
| Country Code | Text | 80 | No |
| Dealer Name | Text | 557 | No |
| Dealer SAP ID | Text | 510 | No |
| SAP ID (TEXT) | Text | 510 | No |
| Target Year | Text | 2 | No |
| Target Month | Text | 12 | No |
| Target Quarter | Text | 4 | No |
| Target | Decimal Number | 203 | No |
| Forecast | Decimal Number | 15 | No |
| Type | Text | 3 | No |
| Budget Class | Text | 3 | No |

### FeedFile

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Posting Date | Date | 1,046 | No |
| Destination | Text | 174 | No |
| Sales Organization | Text | 43 | No |
| Country | Text | 22 | No |
| Bill-to party | Text | 14,759 | No |
| Bill-to Party Name | Text | 13,908 | No |
| Bill-to Country | Text | 151 | No |
| Channel | Text | 22 | No |
| Ship-To Party | Text | 12,809 | No |
| Ship-to Party Name | Text | 11,691 | No |
| Ship-to Country | Text | 158 | No |
| Bill-to Customer Updated in APX | Text | 3 | No |
| Sale Document Nr. | Text | 150,233 | No |
| Sale Document Nr._1 | Text | 60 | No |
| Sales doc. type | Text | 62 | No |
| Budget Class | Text | 13 | No |
| Product Family | Text | 82 | No |
| Product Family Name | Text | 104 | No |
| Turnover Material | Text | 2,279 | No |
| Turnover Material Name | Text | 2,710 | No |
| Reporting UoM PF | Text | 5 | No |
| UoM PF Name | Text | 5 | No |
| Material | Text | 5,845 | No |
| Material Name | Text | 5,278 | No |
| MSP | Decimal Number | 3,741 | No |
| Unit | Decimal Number | 2,085 | No |
| CAR Unit of Measure | Text | 5 | No |
| CAR UoM Name | Text | 5 | No |
| General it. cat. gr. | Text | 27 | No |
| Channel Manager | Text | 161 | No |
| Channel Manager Name | Text | 161 | No |
| Net Turnover EUR | Decimal Number | 195,540 | No |
| Sales Quanitity PC | Whole Number | 1,324 | No |
| Quantity (alt. UoM) | Decimal Number | 5,289 | No |
| Calculated Cost DR CR | Decimal Number | 17,697 | No |
| Calculated Cost PFS | Decimal Number | 20,386 | No |
| Calculated Cost APX | Decimal Number | 20,701 | No |
| Cost+ | Decimal Number | 237 | No |
| Year | Whole Number | 4 | No |
| Month | Whole Number | 12 | No |
| Quarter | Whole Number | 4 | No |
| Source.Name | Text | 1 | No |
| Customer ID and Name | Text | 14,938 | No |
| source | Text | 2 | No |
| yr-mnth | Text | 39 | No |
| SAP channel | Text | 7 | No |
| source_ | Type 1 | 2 | No |
| SAP channel_ | Type 1 | 8 | No |

### Implementation_HourlyRate xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Destination | Text | 76 | No |
| Country Code | Text | 70 | No |
| Sofon Rate Ctry Code | Text | 65 | No |
| Calendar Year | Text | 2 | No |
| Hourly Rate EUR | Decimal Number | 36 | No |

### MonthQuarter xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Name of Month | Text | 12 | No |
| Month | Decimal Number | 12 | No |
| Name Quarter | Text | 4 | No |
| Quarter | Decimal Number | 4 | Yes |

### ProductFamilyList xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Budget Class | Text | 5 | No |
| Product Family | Text | 94 | No |
| PF Name | Text | 94 | No |
| M Type Name | Text | 10 | No |
| Modality | Text | 56 | No |
| General it. cat. gr. | Text | 15 | No |
| Functional area | Text | 9 | No |
| TYPE | Text | 3 | No |
| Main Equipment | Text | 5 | No |
| Group | Text | 18 | No |
| UOM | Text | 4 | Yes |

### Region partner dashboard xl

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Country Code | Text | 222 | No |
| Destination | Text | 278 | No |
| Report Country | Text | 240 | No |
| Description | Text | 47 | No |
| Report Group Region | Text | 4 | No |
| IMG SubReg | Text | 43 | No |
| Report Sub-region | Text | 20 | No |
| Fixed Destination | Text | 243 | No |
| Column9 | Text | 1 | Yes |

### Relationships

| From Table | From Column | To Table | To Column | Cardinality | Active |
|---|---|---|---|---|---|
| FeedFile | Budget Class | BudgetClassGroup xl | Budget Class | M:1 | ✓ |
| FeedFile | Product Family | ProductFamilyList xl | Product Family | M:1 | ✓ |
| Implementation_HourlyRate xl | Destination | FeedFile | Destination | M:M | ✓ |
| FeedFile | Destination | Region partner dashboard xl | Destination | M:1 | ✓ |
| DealerList_TargetSetting xl | Target Year | FeedFile | Year | M:M | ✓ |
| DealerList_TargetSetting xl | Budget Class | BudgetClassGroup xl | Budget Class | M:1 | ✓ |
| DealerList_TargetSetting xl | SAP ID (TEXT) | DealerList xl | SAP ID (TEXT) | M:1 | ✓ |
| FeedFile | Bill-to party | DealerList xl | SAP ID (TEXT) | M:1 | ✓ |
| DealerList_TargetSetting xl | Target Month | MonthQuarter xl | Month | M:1 | ✓ |
| FeedFile | Month | MonthQuarter xl | Month | M:1 | ✓ |
| FeedFile | Bill-to party | AP2 customers | Bill-to party | M:1 | ✓ |

---

## Commercial Analytics - Weekly FC Tracker
**Folder:** Dashboards2  
**Tables:** 2

### DataWeek

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Snapshot Week | Text | 10 | No |
| Group of Regions | Text | 3 | No |
| Subregion | Text | 22 | No |
| Destination | Text | 115 | Yes |
| Sold-to party | Text | 1,327 | Yes |
| Sold-to party Name | Text | 1,557 | No |
| Location | Text | 115 | Yes |
| Syracuse/SalesOne Opportunity | Text | 3,989 | No |
| Syracuse/SalesOne Opportunity Name | Text | 4,076 | No |
| Calendar month | Text | 12 | No |
| Closed Date | Text | 209 | No |
| Closed Month | Text | 13 | No |
| Target Date - Quarter | Decimal Number | 4 | No |
| Final Month | Text | 12 | No |
| Final Quarter | Text | 4 | No |
| Requested Delivery Date | Text | 428 | Yes |
| Sub Sales Stage | Text | 13 | No |
| Opportunity status | Text | 3 | No |
| Amount in EUR | Decimal Number | 5,374 | Yes |
| Weighted Amount in EUR | Decimal Number | 7,087 | Yes |
| Feasibility | Decimal Number | 6 | No |
| Deal Percentage | Text | 4 | No |
| Win Percentage | Text | 4 | No |
| Average Probability | Text | 4 | No |
| Forecast Flag | Text | 8 | Yes |
| Flag | Type 1 | 6 | No |
| Funnel Evolution | Text | 6 | No |
| Pl# Order Int# Date | Text | 327 | No |
| Pl# Order Int# Month | Text | 13 | No |
| Act# Order Int# Date | Text | 51 | No |
| Act# Order Int# Month | Text | 4 | No |
| Calendar month2 | Text | 4 | No |
| Act# OIT Quarter | Text | 2 | No |
| Closed Opp# Quarter | Text | 5 | No |
| Final Year | Text | 1 | No |
| Opportunity Date Created | Text | 513 | No |
| Sales Stage | Text | 6 | Yes |
| Opportunity Owner | Text | 97 | No |
| Cal Day | Text | 10 | No |
| First Day of Cal Week | Text | 10 | No |
| Overdue | Whole Number | 2 | No |
| Check Staging | Whole Number | 2 | No |
| Open Opportunity in Funnel | Whole Number | 2 | No |
| Opp Naming Convention | Whole Number | 2 | No |
| Cal Year | Text | 1 | No |
| Cal Quarter | Decimal Number | 1 | No |
| Last Month of Cal Quarter | Text | 1 | No |
| Last Day of Cal Quarter | Text | 1 | No |
| Risk Opp | Whole Number | 2 | No |
| New Opp Created This Week | Whole Number | 2 | No |
| Weeknumber | Decimal Number | 10 | No |
| Invertweek | Decimal Number | 10 | No |
| Region | Text | 37 | No |

### T last refreshed

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Last Update | Date | 1 | No |
| Snapshot Week | Decimal Number | 1 | Yes |

---

## Price Margin Modalities
**Folder:** Dashboards2  
**Mode:** DirectQuery (no data cached in PBIX — queries live source at runtime)  
**Tables:** 2

### Q last refreshed *(DirectQuery)*

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Last Refreshed | Text | 1 | Yes |

### Q price realisation extra *(DirectQuery)*

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| posting date | Text | 1 | Yes |
| year-month | Text | 1 | Yes |
| Year | Text | 1 | Yes |
| destination | Text | 1 | Yes |
| subregion | Text | 1 | Yes |
| region | Text | 1 | Yes |
| sales org | Text | 1 | Yes |
| sales org name | Text | 1 | Yes |
| pf | Text | 1 | Yes |
| pf name | Text | 1 | Yes |
| material | Text | 1 | Yes |
| material name | Text | 1 | Yes |
| base unit | Text | 1 | Yes |
| sales document nr | Text | 1 | Yes |
| sales doc deliv date | Text | 1 | Yes |
| sales doc date | Text | 1 | Yes |
| opportunity | Text | 1 | Yes |
| opportunity name | Text | 1 | Yes |
| bill-to party | Text | 1 | Yes |
| bill-to party name | Text | 1 | Yes |
| ship-to party | Text | 1 | Yes |
| ship-to party name | Text | 1 | Yes |
| functional area | Text | 1 | Yes |
| functional area group | Text | 1 | Yes |
| sales quantity | Decimal Number | 1 | Yes |
| net turnover eur | Decimal Number | 1 | Yes |
| modality | Text | 1 | Yes |
| order | Whole Number | 1 | Yes |
| regional list price | Decimal Number | 1 | Yes |
| discount | Decimal Number | 1 | Yes |
| sofon cost+ | Decimal Number | 1 | Yes |
| gross margin | Decimal Number | 1 | Yes |
| enp | Decimal Number | 1 | Yes |
| quantity | Whole Number | 1 | Yes |
| lsp | Decimal Number | 1 | Yes |
| sales budget | Decimal Number | 1 | Yes |
| margin budget | Decimal Number | 1 | Yes |
| qty budget | Whole Number | 1 | Yes |

---

## Commercial Analytics - Funnel Evolution Tracker
**Folder:** Dashboards3  
**Tables:** 1

### T funnel evolution tracker

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Snapshot Week | Text | 52 | No |
| Region | Text | 38 | No |
| Group of Regions | Text | 3 | No |
| Subregion | Text | 24 | No |
| Destination | Text | 146 | Yes |
| Sold-to party | Text | 3,517 | Yes |
| Sold-to party Name | Text | 5,700 | No |
| Syracuse/SalesOne Opportunity | Text | 15,270 | Yes |
| Syracuse/SalesOne Opportunity Name | Text | 17,084 | Yes |
| Pl# Order Int# Date | Text | 1,541 | Yes |
| Pl# Order Int# Month | Text | 101 | Yes |
| Calendar month | Text | 41 | Yes |
| Act# Order Int# Date | Text | 601 | No |
| Act# Order Int# Month | Text | 44 | No |
| Calendar month2 | Text | 22 | Yes |
| Closed Date | Text | 779 | No |
| Closed Month | Text | 31 | No |
| Target Date - Quarter | Decimal Number | 11 | Yes |
| Act# OIT Quarter | Text | 8 | No |
| Closed Opp# Quarter | Text | 8 | Yes |
| Final Month | Text | 56 | Yes |
| Final Quarter | Text | 6 | Yes |
| Final Year | Text | 2 | Yes |
| Requested Delivery Date | Text | 2,076 | Yes |
| Opportunity Date Created | Text | 616 | Yes |
| Sales Stage | Text | 9 | Yes |
| Sub Sales Stage | Text | 20 | No |
| Opportunity status | Text | 6 | No |
| Opportunity Owner | Text | 220 | No |
| Amount | Decimal Number | 16,411 | Yes |
| Weighted Amount | Decimal Number | 24,181 | Yes |
| Feasibility | Decimal Number | 9 | No |
| Deal Percentage | Text | 11 | Yes |
| Win Percentage | Text | 11 | Yes |
| Average Probability | Text | 24 | Yes |
| Forecast Flag | Text | 12 | Yes |
| Cal Day | Text | 90 | No |
| First Day of Cal Week | Text | 60 | Yes |
| Overdue | Whole Number | 2 | Yes |
| Check Staging | Whole Number | 2 | Yes |
| Open Opportunity in Funnel | Whole Number | 2 | Yes |
| Opp Naming Convention | Whole Number | 2 | Yes |
| Cal Year | Text | 3 | No |
| Cal Quarter | Decimal Number | 4 | No |
| Last Month of Cal Quarter | Text | 5 | Yes |
| Last Day of Cal Quarter | Text | 5 | Yes |
| Risk Opp | Whole Number | 2 | Yes |
| New Opp Created This Week | Whole Number | 2 | Yes |
| Weeknumber | Decimal Number | 51 | Yes |
| Invertweek | Decimal Number | 51 | Yes |
| Quote Type | Text | 2 | Yes |
| Quote Status | Text | 8 | Yes |
| SAP order | Text | 1,225 | Yes |
| Yearly | Text | 3 | No |
| Funnel Evolution | Text | 7 | No |
| Funnel_Number | Text | 6 | No |
| New_Funnel | Text | 6 | No |
| Quarters | Type 1 | 18 | No |
| Monthly view | Text | 2 | No |
| Month_Name | Text | 13 | No |
| Week | Type 1 | 90 | No |
| Snapshot Month | Text | 24 | No |

---

## Commercial Analytics - OI & Funnel Health Cockpit
**Folder:** Dashboards3  
**Tables:** 3

### Others

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Refreshed Date | Text | 1 | No |
| Current Week | Type 1 | 1 | Yes |
| Week of Year | Whole Number | 1 | Yes |

### T funnel health

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| Destination | Text | 133 | Yes |
| Region | Text | 38 | No |
| Group of Regions | Text | 3 | No |
| Subregion | Text | 23 | No |
| Week | Decimal Number | 53 | No |
| RT PY | Decimal Number | 676 | Yes |
| RT CY | Decimal Number | 120 | Yes |
| PY | Decimal Number | 650 | Yes |
| CY | Decimal Number | 117 | Yes |
| Qtr | Text | 4 | No |
| RT BT | Decimal Number | 2,121 | Yes |
| RT FC | Decimal Number | 1,936 | Yes |
| key figure | Text | 8 | No |
| PQ | Decimal Number | 849 | Yes |
| SQ | Decimal Number | 849 | Yes |
| 4Q | Decimal Number | 849 | Yes |
| funnel | Decimal Number | 849 | Yes |
| RT BT Q | Decimal Number | 2,107 | Yes |
| RT FC Q | Decimal Number | 1,932 | Yes |
| funnel HF | Decimal Number | 236 | Yes |
| RT CY Q | Decimal Number | 120 | Yes |
| RT PY Q | Decimal Number | 672 | Yes |
| funnel Q | Decimal Number | 849 | Yes |
| funnel HF Q | Decimal Number | 236 | Yes |
| PQ Q | Decimal Number | 849 | Yes |
| SQ Q | Decimal Number | 849 | Yes |
| 4Q Q | Decimal Number | 849 | Yes |
| FC2 | Decimal Number | 266 | Yes |
| FC2 Q | Decimal Number | 62 | Yes |
| RT FC2 | Decimal Number | 975 | No |
| RT FC2 Q | Decimal Number | 82 | No |

### last refresh

| Column | Data Type | Distinct Values | Nullable |
|---|---|---|---|
| current week | Type 1 | 1 | Yes |
| last refresh date | Date | 1 | No |
| current qtr | Type 1 | 1 | No |

---
