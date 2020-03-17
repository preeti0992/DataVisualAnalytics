import os
import sys
import numpy as np
import pandas as pd

input_file = './Chicago_Crimes_2012_to_2017/Chicago_Crimes_2012_to_2017.csv'
df = pd.read_csv(input_file, error_bad_lines=False)

df_date = df.Date
df_date = pd.to_datetime(df_date)
dfd = df.copy()
dfd['year'] = df_date.dt.year
dfd['month'] = df_date.dt.month
dfd['day'] = df_date.dt.day
dfd['hour'] = df_date.dt.hour
dfd['dayofweek'] = df_date.dt.dayofweek
dfd['day_name'] = df_date.dt.day_name()
dfd['week'] = df_date.dt.week

newDf = pd.DataFrame()
newDf['year'] = pd.Categorical(dfd['year'])
newDf['day'] = pd.Categorical(dfd['day'])
newDf['month'] = pd.Categorical(dfd['month'])
newDf['hour'] = pd.Categorical(dfd['hour'])
newDf['dayofweek'] = pd.Categorical(dfd['dayofweek'])
newDf['ward'] = pd.Categorical(dfd['Ward'])
newDf['crime'] = pd.Categorical(dfd['Primary Type'])
newDf['hour_slot'] = dfd['hour']//4
newDf['hour_slot'] = pd.Categorical(newDf['hour_slot'])

newDf['crime'] = newDf['crime'].map({'THEFT': 'theft', 'BURGLARY': 'theft', 'OFFENSE INVOLVING CHILDREN': 'child_offense',\
                                     'DECEPTIVE PRACTICE': 'deceptive_practice', 'NARCOTICS': 'narcotics',\
                                     'SEX OFFENSE': 'sexual_crime', 'CRIM SEXUAL ASSAULT': 'sexual_crime',\
                                     'MOTOR VEHICLE THEFT': 'vehicle_theft', 'BATTERY': 'assault', 'ASSAULT': 'assault',
                                     'OTHER OFFENSE': 'other_offenses', 'WEAPONS VIOLATION': 'other_offenses', 
                                     'PUBLIC PEACE VIOLATION': 'other_offenses','CRIMINAL TRESPASS': 'other_offenses',
                                     'GAMBLING': 'other_offenses', 'PROSTITUTION': 'other_offenses',
                                     'LIQUOR LAW VIOLATION': 'other_offenses', 'CRIMINAL DAMAGE': 'criminal_damage',
                                     'STALKING': 'assault', 'ARSON': 'criminal_damage',
                                     'INTERFERENCE WITH PUBLIC OFFICER': 'other_offenses'
                                    })
newDf['crime'] = pd.Categorical(newDf['crime'])

newDf.to_csv('./clean_output/Chicago_Crimes_2012_to_2017.csv', index=False)