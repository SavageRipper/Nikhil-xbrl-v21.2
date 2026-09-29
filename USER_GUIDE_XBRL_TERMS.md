# XBRL Terms — Simple User Guide

## Concept / QName
A **concept** is the taxonomy definition of what you are reporting. Its QName is the technical name, for example `in-gaap:DepreciationTangibleAssets`.

## Fact
A **fact** is the value you report for a concept in a particular context and unit.

## Context
A **context** tells XBRL **who, when and under which dimensions** the fact belongs to. It contains the entity/CIN, period or date, and any dimensions.

## Dimension / Axis
An **axis** is a dimension used to analyse a table. Example: `ClassesOfTangibleAssetsAxis`.

## Member
A **member** is a value on an axis. Example: `PlantAndEquipmentMember`.

## Table / Hypercube
An XBRL table/hypercube groups the axes and line items that form one disclosure structure.

## Line item
A **line item** is the actual concept whose value is reported. Headings/abstracts organise line items but are not themselves entered as facts.

## Unit
A **unit** tells XBRL what a numeric value measures. Examples: INR, shares, or INR per share.

**Unit is not scale.** `INR` says the number is rupees. `Lakhs` is only a presentation/input scale used by this workbench.

## TextBlock
A **TextBlock** is a narrative disclosure that can contain permitted formatted HTML. V15 provides the rich-text editor for TextBlock line items, including TextBlocks inside tables.

## Why V15 shows table instances
Instead of asking you to add one row per XBRL fact, V15 shows the taxonomy-defined table and its complete line-item structure. You select the applicable member combination, then fill the line items underneath it.

## One-line memory aid

**QName = what** → **Fact = value** → **Context = who/when/dimensions** → **Unit = how measured**
