import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { TicketTypes, TicketSeverityTypes, LocalStorageKeys } from './../Enums/Enums';
import { ITicketModel } from './../Models/ITicketModel';


@Injectable({
  providedIn: 'root'
})
export class TicketStorageService {

  constructor() {}

  // #region "LocalStorage Functionality"
  ///////////////////////////////////////
  /**
   * Get All Tickets from LocalStorage
   */
  getAllTickets(): ITicketModel[] {
    return JSON.parse(localStorage.getItem(LocalStorageKeys.Tickets));
  }

  /**
   * Save Ticket to LocalStorage
   * @param newTicket
   */
  saveTicket(newTicket: ITicketModel): void {
    let currentTickets: ITicketModel[] = this.getAllTickets();
    currentTickets != null ? currentTickets.push(newTicket) : currentTickets = [newTicket];
    this.saveAllTickets(currentTickets);
  }

  /**
   * Saves all current tickets to LocalStorage
   * @param currentTickets
   */
  private saveAllTickets(currentTickets: ITicketModel[]): void {
    localStorage.setItem(LocalStorageKeys.Tickets, JSON.stringify(currentTickets));
  }

  /**
   * Delete specified ticket index from LocalStorage
   * @param index
   */
  deleteTicket(index: number): void {
    const currentTickets: ITicketModel[] = this.getAllTickets();
    currentTickets.splice(index, 1);
    this.saveAllTickets(currentTickets);
  }
  //////////////////////////////////////////
  // #endregion "LocalStorage Functionality"




  // #region "Firebase Functionality"
  ///////////////////////////////////

  getAllFirebaseTickets(): ITicketModel[] {

    // Create the query to load the last 12 tickets and listen for new ones.
    let currentTickets = [] as ITicketModel[];

    var query = firebase.firestore()
    .collection('tickets')
    // .limit(12);

    query.onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if(change.type === 'removed') {
          // deleteTicket(change.doc.id);
        } else {
          let ticket = change.doc.data() as ITicketModel;
          ticket.id = change.doc.id;
          currentTickets.push(ticket);
        }
      });
    });

    return currentTickets;
  }

  /**
   * Save ticket to Firebase DB
   * @param newTicket
   */
  saveFirebaseTicket(newTicket: ITicketModel): Promise<any> {
    return firebase.firestore().collection('tickets').add( {
      subject: newTicket.subject,
      type: newTicket.type,
      severity: newTicket.severity,
      ticketReason: newTicket.ticketReason
    })
      .catch((e) => {
      console.error('Error writing new ticket to database', e);
    });
  }

  /**
   * Delete ticket from Firebase DB
   * @param id
   */
  deleteFirebaseTicket(id: string): Promise<void> {
    try{
      return firebase.firestore().collection('tickets').doc(id).delete();
    }
    catch(e) {
      console.error('unable to delete ticket', e);
    }
  }
  //////////////////////////////////////
  // #endregion "Firebase Functionality"
}
