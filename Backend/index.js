/* eslint-disable no-restricted-globals */

//import important libraries
const express = require("express");
require("actions-on-google");
const axios = require("axios");
const { WebhookClient } = require("dialogflow-fulfillment");
const app = express();
const { google } = require("googleapis");
const {BigQuery} = require('@google-cloud/bigquery');

//calender initializaition
const calendarId = process.env.CALENDAR_ID;
const serviceAccount = {
  type: "service_account",
  project_id: "ajax-yhar",
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvPdCVFZsa955I\nK/VUkYvR51TZ2TxnkoPeAVr0i0PbVmF6otpam7IyOl5QrBS4e5uh1QkWj4oQMzXg\nKkDu5QDndaiIBIc6QFljwHVz1BgPgPhL48I190rHTHIJOl6oFbt1oOiqdSoddTLF\nOe7fNHC1Q5+CfL7MIEAfVl0vpHZog4t+iZHG+5Yx2AM2EoCknxRxi/4VbhY6y5bP\nHVPLsbUnyWAh2nWpleSzQVidCvMwZX0VkeNZJOZ8FP5wmQPu784J7Uga5KDr55ja\nOFCRtSftZUwSFLDaQEf6T8W3OOmiCucXIkLJ7Y53No4pwsSarHoi/W68PI460BVZ\nEJhgR1k1AgMBAAECggEABHLhiXNdt2rLXCIvjXjPb6H7i7dB2xBDZD6tEDG75ITW\nHy6ks/GpbbCBJfOkaAWNTyexHh9BPkWKi9kOwnHSWs3oHCHfS/mHu2pOoQTkonof\n849B5ixTu+kDKRxP/Fzm4CbYWUF1sv8/bXXZzFVQui1QDpg7oMN91T3USkoWznLj\nmmkSo7S+8mgX7V65gd4V/W6DqS5VJpGGs13/DLX09mHF6AwEYYyTiKfGaQGRTgR3\nfRaJ2C21UfLy0N2IrGIYIutJqr7ccxnM2m8slYvozsVd8jzCmLxKifcVRV7IlMcb\n646aR3cjKisrhHEY/313Yo993wfOx0id5KIvt+QWaQKBgQDz6OaeTyqdrmssUr1O\nFzTP2atTBR7xFa8CtuGdvxUMnqKb1B6VDUm9k2q0Nd5CMwYy7bDMjXYjF8Yr2ciG\n1Aa0O4zfTkDaYOTejR1BSZKnqJ6s0rKG6Mf7udif/rEyjR6IbMbN7IhkmEMEWVUo\n4aj+GVL9tO2FDjiR9AzjjBi0CQKBgQC37Yu1h/1+DGar9s/3LuL2O44uF4DoxDlF\nrRwkayniORpps8ypA9upYKWWFqCfW85h4bXwaQtasrOQ9Dx14tKOUlTHbIFuxDYq\nZbh3EjRfUBjLFZOBJjnSu4rEjz8O0PX0xyCWlxb6WusftECcXPeAfu7iqFgHMsND\nCelhCP0+zQKBgQCjMIhcEwuoRDJgjVsrDEvBZRlDioGRO7jEUCfTqy0iLGEPcXSk\ntSdJN4CE4iW6lPjoyi8oLN2FzTpBzIxl6SYzIES4g1rQwVNfs3qHW/pLQn4nkzDv\nIn/q5AUTxww3jkOHc3/v9vmqlFUCa+KWX6T5nWfxZ0QjachfnrGg7PL6QQKBgG4I\nj6c3RwCsnJPOIRZIl4ElmeabKwSVt4mmiYqEDdeHv/Rym0KVy0jmR8mlmcwcWTiX\nlofP3/oPpHtYkf8YhkyclpmDoV9JxPnSRuv9GRXYTizYqJj/7GHUzqzO4bOUcUBS\nDH3qv9VgpP8fj/O7bloSFgnFGnyb8tLdUCA8B30VAoGBALYokRRlUj7/kP8GsjWw\na0usQfHjQKyMuyGb0sAv1TQg1mdxxuYWKgNrzpB+ib0pmBzj5M2w/Uf11nHDa2Lm\nT6Fbm66oXbwIwgILfKIOyKdJpfyZJlN7x9SjYNF6nD30jB9RKcojUUVextGpB37K\nW/isydIvlghv6RjzeAYGHKux\n-----END PRIVATE KEY-----\n",
  client_email: "ajax-bot@ajax-yhar.iam.gserviceaccount.com",
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/ajax-bot%40ajax-yhar.iam.gserviceaccount.com",
};

const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: "https://www.googleapis.com/auth/calendar",
});

const calendar = google.calendar("v3");
process.env.DEBUG = "dialogflow:*"; // enables lib debuggin  g statements

const timeZone = "Asia/Kolkata";
const timeZoneOffset = "+05:30";

//main post call to connect dialogflow with backend
app.post("/webhook", express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function createCalendarEvent(appointment, startTime, endTime) {
    return new Promise((resolve, reject) => {
      calendar.events.list(
        {
          auth: serviceAccountAuth,
          calendarId: calendarId,
          timeMin: startTime.toISOString(),
          timeMax: endTime.toISOString(),
        },
        (err, res) => {
          if (err || res.data.items.length > 0) {
            return reject(`The event is conflicting with another event`);
          } else {
            calendar.events.insert(
              {
                auth: serviceAccountAuth,
                calendarId: calendarId,
                resource: {
                  summary: appointment,
                  description: appointment,
                  start: { dateTime: startTime },
                  end: { dateTime: endTime },
                },
              },
              (err, events) => {
                if (err)
                  return reject(
                    `There was an error contacting the Calendar service: ${err}`
                  );
                return resolve(events);
              }
            );
          }
        }
      );
    });
  }

  //add appointment to the big query for visualizaton 
  function addToBigQuery(agent, appointment) {
    const date_bq = agent.parameters.date.split('T')[0];
    const time_bq = agent.parameters.time.split('T')[1].split('+')[0];

    const projectId = "ajax-yhar"; 
    const datasetId = "demo_dataset";
    const tableId = "demo_table";
    const bigquery = new BigQuery({
      projectId: projectId
    });
   const rows = [{date: date_bq, time: time_bq, type: appointment}];
  
   bigquery
  .dataset(datasetId)
  .table(tableId)
  .insert(rows)
  .then(() => {
    agent.add(`Added ${date_bq} and ${time_bq} into the table`);
  })
  .catch(err => {
    if (err && err.name === 'PartialFailureError') {
      if (err.errors && err.errors.length > 0) {
        console.log('Insert errors:');
        err.errors.forEach(err => console.error(err));
      }
    } else {
      console.error('ERROR:', err);
    }
  });
}

  //add expense in to the big query for visualizaton 
  function addToBQExpIn(agent) {
      const receivedFrom = agent.parameters.person.name;
      const amount_num = agent.parameters.unit_currency.amount;
      const date = agent.parameters.date_time.date_time.split('T')[0];
      const time = agent.parameters.date_time.date_time.split('T')[1].split('+')[0];
    
      const projectId = "ajax-yhar"; 
      const datasetId = "expense_manager";
      const tableId = "expense_inflow";
      const bigquery = new BigQuery({
        projectId: projectId
      });
     const rows = [{receivedFrom: receivedFrom, amount_num: amount_num, 
            date: date, 
          time: time 
         }];
    
     bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
      agent.add(`Added material of ${amount_num} from ${receivedFrom} at ${date} ${time} into the table`);
    })
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
          console.log('Insert errors:');
          err.errors.forEach(err => console.error(err));
        }
      } else {
        console.error('ERROR:', err);
      }
    });
  }

  //add expense out to the big query for visualizaton 
  function addToBQExpOut(agent) {
      const expenseCategory = agent.parameters.expenseCategory;
      const amount_num = agent.parameters.unit_currency.amount;
      const date = agent.parameters.date_time.date_time.split('T')[0];
      const time = agent.parameters.date_time.date_time.split('T')[1].split('+')[0];
    
      const projectId = "ajax-yhar"; 
      const datasetId = "expense_manager";
      const tableId = "expense_outflow";
    
      const bigquery = new BigQuery({
        projectId: projectId
      });
     const rows = [{expenseCategory: expenseCategory, date: date, time: time, amount_num: amount_num }];
    
     bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows)
    .then(() => {
      agent.add(`Debited income of ${amount_num} in ${expenseCategory} at ${date} ${time}`);
    })
    .catch(err => {
      if (err && err.name === 'PartialFailureError') {
        if (err.errors && err.errors.length > 0) {
          console.log('Insert errors:');
          err.errors.forEach(err => console.error(err));
        }
      } else {
        console.error('ERROR:', err);
      }
    });
  }

  //add appointment to the calendar
  function makeAppointment(agent) {
    // Calculate appointment start and end datetimes
    const appointment = agent.parameters.AppointmentType;
    const dateTimeStart = new Date(
      Date.parse(
        agent.parameters.date.split("T")[0] +
          "T" +
          agent.parameters.time.split("T")[1].split("+")[0] +
          timeZoneOffset
      )
    );
    
    let dateTimeEnd = new Date(
      new Date(dateTimeStart).setHours(dateTimeStart.getHours() + agent.parameters.duration.amount)
    );
    
    const appointmentTimeString = dateTimeStart.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      hour: "numeric",
      timeZone: timeZone,
    });

    //   Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(appointment, dateTimeStart, dateTimeEnd)
      .then(() => {
        addToBigQuery(agent, appointment);
        agent.add(
          `Ok, let me see if we can fit you in. I have added ${appointment} on ${appointmentTimeString}!`
        );
      }).catch(() => {
        agent.add(
          `I'm sorry, there are no slots available for ${appointmentTimeString}.`
        );
      });
  }

  //to validate the expense added
  function makeExpIn(agent) {
    const currentdate = new Date();
    const agent_date = new Date(
      Date.parse(
        agent.parameters.date_time.date_time.split("T")[0] +
          "T" +
          agent.parameters.date_time.date_time.split("T")[1].split("+")[0] +
          timeZoneOffset
      )
    );

    //cannot add expense of the future
    if(currentdate.getTime() < agent_date.getTime()){
      agent.add("Future expenses cannot be added");
    }
    else{
      addToBQExpIn(agent);
      agent.add("Added successfully");
    }

  }

  //to validate the expense added
  function makeExpOut(agent) {
    const currentdate = new Date();
    const agent_date = new Date(
      Date.parse(
        agent.parameters.date_time.date_time.split("T")[0] +
          "T" +
          agent.parameters.date_time.date_time.split("T")[1].split("+")[0] +
          timeZoneOffset
      )
    );

    //cannot add expense of the future
    if(currentdate.getTime() < agent_date.getTime()){
      agent.add("Future expenses cannot be added");
    }
    else{
      addToBQExpOut(agent);
      agent.add("Debited successfully");
    }
  }

  //connect platform with the power of chatgpt
  async function queryGPT(agent) {
    const instance = axios.create({
      baseURL: "https://api.openai.com/v1/",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });

    const dialog = [
      `The following is a conversation with an AI assistant that can have meaningful conversations with users. The assistant is helpful, empathic, and friendly. Its objective is to make the user feel better by feeling heard. With each response, the AI assisstant prompts the user to continue the conversation in a natural way.
AI: Hello, I am your personal digital AI assistant, NOVA. How are you doing today?`,
    ];
    
    let query = agent.query;
    console.log("querytext ", query);
    dialog.push(`User: ${query}`);
    dialog.push("AI:");

    const completionParmas = {
      prompt: dialog.join("\n"),
      max_tokens: 60,
      temperature: 0.85,
      n: 1,
      stream: false,
      logprobs: null,
      echo: false,
      stop: "\n",
    };

    try {
      const result = await instance.post(
        "/engines/davinci/completions",
        completionParmas
      );
      const botResponse = result.data.choices[0].text.trim();
      agent.add(botResponse);
    } catch (err) {
      console.log(err);
      agent.add("Sorry. Something went wrong. Can you say that again?");
    }
  }

  //intent mapping to respective functions
  let intentMap = new Map();
  intentMap.set("schedule_drv", makeAppointment);
  intentMap.set("expense_INFLOW", makeExpIn);
  intentMap.set("expense_OUTFLOW", makeExpOut);
  intentMap.set("Default Fallback Intent", queryGPT);
  agent.handleRequest(intentMap);
});

const port = 3000;
app.listen(port, () => console.log(`App listening on port ${port}!`));
