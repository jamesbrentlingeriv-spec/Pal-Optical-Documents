/* Pal Optical Forms Web App - Contact Lens Order & Pickup Management System

 *

 * Comprehensive Multi-Station Workflow:

 * 1. Daily Orders Pad (16-Row Landscape Pad matching original physical pad)

 * 2. Doctor's Ordering Queue & Rx Input Station (Doctor clicks "Ordered" & enters Rx)

 * 3. Waiting to be Picked Up Sheet (50-Row Landscape Pad matching physical tracking sheet)

 * 4. Search Past Order History (Instant multi-field search across all past orders)

 * 5. Automatic Multi-Computer Cloud / Serverless Synchronization

 */



export class ContactLensOrderForm {

  constructor(container, state = {}, onStateChange, options = {}) {

    this.container = container;

    this.onStateChange = onStateChange;

    this.options = options || {};



    const todayStr = new Date().toLocaleDateString('en-US', {

      month: '2-digit',

      day: '2-digit',

      year: 'numeric'

    });



    // Helper to generate 16 empty daily pad rows

    const createEmptyDailyRows = (startId = 1) =>

      Array.from({ length: 16 }, (_, i) => ({

        id: startId + i,

        name: '',

        dob: '',

        phone: '',

        boxes: '',

        instructions: '',

        status: 'pending_doctor', // 'pending_doctor' | 'ordered' | 'completed'

        orderId: null

      }));



    // Seed realistic sample orders from the physical office tracking sheet if fresh

    const getInitialSampleOrders = () => [

      {

        id: 'cl_order_sample_01',

        dateOrdered: '4/28/2026',

        patient: 'Jennifer Doops',

        patientNotes: '"CAN TAKE AND TRY"',

        phone: '859-552-4485',

        dob: '03/12/1982',

        brand: "Biofinity Multifocals (trials)",

        rxRight: '+1.75 +2.00 N',

        qtyRight: '1',

        rxLeft: '+2.00 +2.00 D',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '05/15/2026',

        drawer: '3',

        dateCalled: '05/15/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: '1 box each',

        frontInstructions: 'Dr. Robbins trial fit'

      },

      {

        id: 'cl_order_sample_02',

        dateOrdered: '04/28/2026',

        patient: 'Jillian Ashcroft',

        patientNotes: '*NEEDS FITTING. WILL OWE $50*',

        phone: 'SCHEDULE FIT\n859-691-1422',

        dob: '11/04/1990',

        brand: 'Air Optix for Astigmatism (trials)',

        rxRight: '-1.25-2.25x100',

        qtyRight: '1',

        rxLeft: '-0.50-1.75x090',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '05/01/2026',

        drawer: '3',

        dateCalled: '05/01/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: 'Trials',

        frontInstructions: 'Needs fitting, owe $50'

      },

      {

        id: 'cl_order_sample_03',

        dateOrdered: '5/1/2026',

        patient: 'Willie Jones',

        patientNotes: '"CAN TAKE AND TRY"',

        phone: '859-230-0144',

        dob: '07/21/1975',

        brand: 'Oasys Multifocals (trials)',

        rxRight: '-3.25 High',

        qtyRight: '2',

        rxLeft: 'same both eyes',

        qtyLeft: '-',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '05/06/2026',

        drawer: '5',

        dateCalled: '05/06/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: '2 boxes',

        frontInstructions: 'Self pay'

      },

      {

        id: 'cl_order_sample_04',

        dateOrdered: '5/1/2026',

        patient: 'Tyree Bailey',

        patientNotes: '',

        phone: '859-687-4516\ndont call',

        dob: '09/15/1988',

        brand: 'Air Optix\nUltra for Astigmatism (reg)\nUltra for Astigmatism (mono)',

        rxRight: '-6.25\n+2.50-2.75x170\n+5.00-2.75x170',

        qtyRight: '1',

        rxLeft: '-5.75\n+1.25-0.75x180\n+1.25-0.75x180',

        qtyLeft: '1',

        amtDue: '$130.00',

        paid: '-',

        dateReceived: '05/02/2026',

        drawer: '7',

        dateCalled: '05/02/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: 'Annual supply',

        frontInstructions: 'dont call, will pick up'

      },

      {

        id: 'cl_order_sample_05',

        dateOrdered: '5/7/2026',

        patient: 'Ethel Davis',

        patientNotes: 'DONT CALL. SHE WILL CALL TO SCHEDULE FIT\n*JUST WANTED TO HAVE SOME IN STOCK IF SHE SCHEDULES FIT*',

        phone: 'dont call',

        dob: '04/18/1962',

        brand: 'Air Optix (reg)\nAir Optix (mono)\nBiofinity Toric (trials-distance only)',

        rxRight: '+1.25\n+3.75\n-0.25-1.25x150',

        qtyRight: '1',

        rxLeft: '+1.00\n+1.00\npl-0.75x050',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '05/15/2026',

        drawer: '3',

        dateCalled: '-',

        status: 'received',

        doctorOrdered: true,

        boxesRequested: 'Trials in stock',

        frontInstructions: 'Stock trials for fit'

      },

      {

        id: 'cl_order_sample_06',

        dateOrdered: '5/18/2026',

        patient: 'Leland Lawson',

        patientNotes: '"CAN TAKE AND TRY"\n*HOLD DIST ONLY UNTIL SEE IF LIKES',

        phone: '859-299-5139\nMULTIFOCALS*',

        dob: '08/30/1971',

        brand: 'Ultra for Astigmatism (trials distance only)\nUltra for Astigmatism (trials mono)\nUltra Multifocals for Astigmatism (trials)',

        rxRight: '-0.75-1.75x090\n-0.75-1.75x090\n-0.75-1.75x090 High',

        qtyRight: '1',

        rxLeft: 'pl-2.25x100\n+2.25-2.25x100\npl-2.25x100 High',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '06/10/2026',

        drawer: '3',

        dateCalled: 'LVM',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: 'Trials',

        frontInstructions: 'Hold dist only'

      },

      {

        id: 'cl_order_sample_07',

        dateOrdered: '6/4/2026',

        patient: 'Rodney Rice',

        patientNotes: '*NEEDS FITTING*',

        phone: '*SCHEDULE FIT*\n859-420-7535',

        dob: '02/14/1985',

        brand: 'Ultra for Astigmatism (distance trials)\nUltra for Astigmatism (mono trials)\nUltra Multi for Astigmatism (bifocal trials)',

        rxRight: 'pl-2.25x080\npl-2.25x080\npl-2.25x080 High',

        qtyRight: '1',

        rxLeft: 'pl-2.75x090\n+2.25-2.75x090\npl-2.75x090 High',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '07/03/2026',

        drawer: '5',

        dateCalled: '07/03/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: 'Trials',

        frontInstructions: 'Schedule fit'

      },

      {

        id: 'cl_order_sample_08',

        dateOrdered: '6/25/2026',

        patient: 'Michelle Combs',

        patientNotes: '*FIT SCHEDULED 07/07/26*\n*ORDERED 3 PAIRS*',

        phone: '859-866-7453',

        dob: '10/05/1994',

        brand: 'Acuvue 2',

        rxRight: '-6.50',

        qtyRight: '2',

        rxLeft: '-5.75',

        qtyLeft: '2',

        amtDue: '$220.00',

        paid: '-',

        dateReceived: '07/13/26, 07/10/26',

        drawer: '10',

        dateCalled: '07/11/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: '3 pairs',

        frontInstructions: 'Fit scheduled 07/07/26'

      },

      {

        id: 'cl_order_sample_09',

        dateOrdered: '6/25/2026',

        patient: 'Chenille Rivera',

        patientNotes: '',

        phone: '859-913-6348',

        dob: '05/29/1989',

        brand: 'Biofinity Toric XR',

        rxRight: '-4.25-3.75x170',

        qtyRight: '1',

        rxLeft: '-5.00-2.75x030',

        qtyLeft: '1',

        amtDue: '$280.00',

        paid: '-',

        dateReceived: '(R)7/03 (L)7/11',

        drawer: '10',

        dateCalled: '(R)7/03 (L)7/11',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: 'Toric XR',

        frontInstructions: 'Self pay'

      },

      {

        id: 'cl_order_sample_10',

        dateOrdered: '6/26/2026',

        patient: 'Jorge Urbizo',

        patientNotes: '',

        phone: '859-333-4799',

        dob: '12/12/1980',

        brand: 'Air Optix Colors (P Hazel)',

        rxRight: '-1.00',

        qtyRight: '1',

        rxLeft: 'same both eyes',

        qtyLeft: '-',

        amtDue: '$115.00',

        paid: '-',

        dateReceived: '06/29/2026',

        drawer: '8',

        dateCalled: '06/29/2026',

        status: 'called',

        doctorOrdered: true,

        boxesRequested: '1 box each',

        frontInstructions: 'Pure Hazel Colors'

      },

      {

        id: 'cl_order_sample_11',

        dateOrdered: '6/26/2026',

        patient: 'Toccara Parks',

        patientNotes: '',

        phone: '859-310-8040',

        dob: '06/08/1992',

        brand: 'Air Optix for Astigmatism (trials)',

        rxRight: '-1.00-1.75x110',

        qtyRight: '1',

        rxLeft: '-1.50-1.25x070',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '7/6/2026',

        drawer: '3',

        dateCalled: '-',

        status: 'received',

        doctorOrdered: true,

        boxesRequested: 'Trials',

        frontInstructions: 'Air optix astig trials'

      }

    ];



    // Safely retrieve stored data from localStorage

    let savedOrders = null;

    let savedMasterData = null;

    try {

      if (typeof localStorage !== 'undefined') {

        const localDaily = localStorage.getItem('pal-cl-daily-orders');

        if (localDaily) savedOrders = JSON.parse(localDaily);



        const localMaster = localStorage.getItem('pal-cl-master-database');

        if (localMaster) savedMasterData = JSON.parse(localMaster);

      }

    } catch (e) {

      console.warn('Could not read localStorage CL data:', e);

    }



    // Determine 16-row daily pad data

    let rawDailyRows = (state && Array.isArray(state.rows) && state.rows.length)

      ? state.rows

      : (savedOrders && Array.isArray(savedOrders.rows) && savedOrders.rows.length)

        ? savedOrders.rows

        : createEmptyDailyRows(1);



    const safeDailyRows = rawDailyRows.map((r, i) => ({

      id: i + 1,

      name: String(r?.name || ''),

      dob: String(r?.dob || ''),

      phone: String(r?.phone || ''),

      boxes: String(r?.boxes || ''),

      instructions: String(r?.instructions || ''),

      status: r?.status || 'pending_doctor',

      orderId: r?.orderId || null

    }));



    while (safeDailyRows.length < 16) {

      safeDailyRows.push({

        id: safeDailyRows.length + 1,

        name: '',

        dob: '',

        phone: '',

        boxes: '',

        instructions: '',

        status: 'pending_doctor',

        orderId: null

      });

    }



    // Master list of all orders (for Doctor Queue, Waiting Sheet, History)

    let masterOrders = (state && Array.isArray(state.allOrders) && state.allOrders.length)

      ? state.allOrders

      : (savedMasterData && Array.isArray(savedMasterData.allOrders) && savedMasterData.allOrders.length)

        ? savedMasterData.allOrders

        : getInitialSampleOrders();



    // Default tab: 'pickup' if launched from sidebar CL Waiting to Pick Up, else 'pad'

    const initialTab = this.options.initialTab || (state?.activeTab) || 'pad';



    this.state = {

      activeTab: initialTab, // 'pad' | 'doctor' | 'pickup' | 'history'

      batchDate: state?.batchDate || savedOrders?.batchDate || todayStr,

      rows: safeDailyRows,

      allOrders: masterOrders,

      searchQuery: '',

      historyFilter: 'all', // 'all' | 'pending' | 'ordered' | 'received' | 'called' | 'completed'

      activeDoctorModalOrder: null, // order object currently being edited by doctor

      forceBlankPrint: false,

      printTargetSheet: 'pad', // 'pad' or 'pickup'

      syncStatus: 'idle', // 'idle' | 'syncing' | 'synced' | 'error'

      lastSyncedAt: savedMasterData?.lastSyncedAt || null,

      quickName: '',

      quickDob: '',

      quickPhone: '',

      quickBoxes: '',

      quickInstructions: '',

      ...state,

      rows: safeDailyRows,

      allOrders: masterOrders

    };



    // Real-time synchronization

    this.broadcastChannel = null;

    this.pollTimer = null;

    this.styleTag = null;



    this.initLandscapeStyle();

    this.initSyncChannels();

    this.render();

    this.bindEvents();



    // Initial background fetch from server

    this.fetchServerData();

  }



  initLandscapeStyle() {

    if (typeof document === 'undefined') return;

    const existing = document.getElementById('contact-lens-page-style');

    if (existing) existing.remove();



    this.styleTag = document.createElement('style');

    this.styleTag.id = 'contact-lens-page-style';

    this.styleTag.textContent = `

      @page {

        size: letter landscape !important;

        margin: 0.25in !important;

      }

    `;

    document.head.appendChild(this.styleTag);

  }



  initSyncChannels() {

    // Inter-tab sync on same machine

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {

      try {

        this.broadcastChannel = new BroadcastChannel('pal-cl-orders-channel');

        this.broadcastChannel.onmessage = (event) => {

          if (event.data && event.data.type === 'SYNC_ORDERS') {

            this.handleRemoteSync(event.data.payload);

          }

        };

      } catch (e) {

        console.warn('BroadcastChannel error:', e);

      }

    }



    // Polling server for multi-computer sync (doctor's computer <-> front desk computer)

    if (typeof window !== 'undefined') {

      this.pollTimer = setInterval(() => {

        this.fetchServerData(true);

      }, 10000); // Poll every 10 seconds



      // Also check on window focus

      window.addEventListener('focus', () => {

        this.fetchServerData(true);

      });

    }

  }



  destroy() {

    if (this.styleTag) {

      this.styleTag.remove();

      this.styleTag = null;

    }

    if (this.pollTimer) {

      clearInterval(this.pollTimer);

      this.pollTimer = null;

    }

    if (this.broadcastChannel) {

      try { this.broadcastChannel.close(); } catch (e) {}

      this.broadcastChannel = null;

    }

  }



  getPatientName() {

    if (this.state.activeTab === 'pickup') {

      return `CL Waiting to Pick Up (${this.getWaitingOrders().length} Patients)`;

    }

    if (this.state.activeTab === 'doctor') {

      return `Doctor CL Order Queue (${this.getPendingDoctorOrders().length} Pending)`;

    }

    const filled = this.state.rows.filter(r => (r?.name || '').trim().length > 0);

    if (filled.length === 1) {

      return `Contact Lens Orders - ${filled[0].name.trim()}`;

    }

    if (filled.length > 1) {

      return `Contact Lens Orders (${filled.length} Orders) - ${this.state.batchDate}`;

    }

    return 'Contact Lens Orders';

  }



  notifyChange(skipBroadcast = false) {

    // Save to local storage

    try {

      if (typeof localStorage !== 'undefined') {

        localStorage.setItem('pal-cl-daily-orders', JSON.stringify({

          batchDate: this.state.batchDate,

          rows: this.state.rows

        }));

        localStorage.setItem('pal-cl-master-database', JSON.stringify({

          allOrders: this.state.allOrders,

          lastSyncedAt: new Date().toISOString()

        }));

      }

    } catch (e) {

      console.warn('Could not persist to localStorage:', e);

    }



    // Broadcast to other browser tabs

    if (!skipBroadcast && this.broadcastChannel) {

      try {

        this.broadcastChannel.postMessage({

          type: 'SYNC_ORDERS',

          payload: {

            rows: this.state.rows,

            allOrders: this.state.allOrders,

            batchDate: this.state.batchDate

          }

        });

      } catch (e) {}

    }



    // Notify app parent callback

    if (typeof this.onStateChange === 'function') {

      this.onStateChange(this.state);

    }



    // Push to server for other computers

    this.pushServerData();

  }



  async fetchServerData(silent = false) {

    try {

      const res = await fetch('/api/contact-lens-orders');

      if (res.ok) {

        const json = await res.json();

        if (json && json.success && json.data) {

          const remoteData = json.data;

          let changed = false;



          // Merge allOrders if remote has newer or more orders

          if (Array.isArray(remoteData.allOrders) && remoteData.allOrders.length) {

            const remoteMap = new Map(remoteData.allOrders.map(o => [o.id, o]));

            const localMap = new Map(this.state.allOrders.map(o => [o.id, o]));



            remoteMap.forEach((remOrder, id) => {

              const locOrder = localMap.get(id);

              if (!locOrder) {

                localMap.set(id, remOrder);

                changed = true;

              } else if (remOrder.updatedAt && (!locOrder.updatedAt || remOrder.updatedAt > locOrder.updatedAt)) {

                localMap.set(id, { ...locOrder, ...remOrder });

                changed = true;

              }

            });



            if (changed) {

              this.state.allOrders = Array.from(localMap.values());

            }

          }



          // Merge daily pad rows

          if (Array.isArray(remoteData.rows) && remoteData.rows.length) {

            remoteData.rows.forEach((remRow, idx) => {

              if (idx < this.state.rows.length) {

                const locRow = this.state.rows[idx];

                if ((remRow.name || '').trim() && !(locRow.name || '').trim()) {

                  this.state.rows[idx] = { ...locRow, ...remRow };

                  changed = true;

                }

              }

            });

          }



          if (changed) {

            this.state.lastSyncedAt = new Date().toLocaleTimeString();

            this.state.syncStatus = 'synced';

            this.render();

            this.bindEvents();

          }

        }

      }

    } catch (e) {

      if (!silent) console.warn('Fetch server orders notice:', e);

    }

  }



  async pushServerData() {

    try {

      this.state.syncStatus = 'syncing';

      const payload = {

        batchDate: this.state.batchDate,

        rows: this.state.rows,

        allOrders: this.state.allOrders,

        updatedAt: new Date().toISOString()

      };



      const res = await fetch('/api/contact-lens-orders', {

        method: 'POST',

        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify(payload)

      });



      if (res.ok) {

        this.state.syncStatus = 'synced';

        this.state.lastSyncedAt = new Date().toLocaleTimeString();

      } else {

        this.state.syncStatus = 'idle';

      }

    } catch (e) {

      this.state.syncStatus = 'idle';

    }

  }



  handleRemoteSync(payload) {

    if (!payload) return;

    let needsRerender = false;

    if (payload.allOrders && Array.isArray(payload.allOrders)) {

      this.state.allOrders = payload.allOrders;

      needsRerender = true;

    }

    if (payload.rows && Array.isArray(payload.rows)) {

      this.state.rows = payload.rows;

      needsRerender = true;

    }

    if (payload.batchDate) {

      this.state.batchDate = payload.batchDate;

    }

    if (needsRerender) {

      this.render();

      this.bindEvents();

    }

  }



  // Filtered order getters

  getPendingDoctorOrders() {

    return this.state.allOrders.filter(o => o.status === 'pending_doctor' || !o.doctorOrdered);

  }



  getWaitingOrders() {

    // Orders that the doctor has ordered and are either in transit, received in drawer, or called

    return this.state.allOrders.filter(o => o.doctorOrdered && o.status !== 'completed');

  }



  getCompletedOrders() {

    return this.state.allOrders.filter(o => o.status === 'completed');

  }



  formatPhone(value) {

    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) return digits;

    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;

    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;

  }



  formatDob(value) {

    if (!value) return '';

    const clean = value.replace(/[^\d\/]/g, '');

    if (!clean.includes('/') && clean.length >= 8) {

      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}/${clean.slice(4, 8)}`;

    }

    return clean;

  }



  escapeAttr(str) {

    if (str == null) return '';

    return String(str)

      .replace(/&/g, '&amp;')

      .replace(/"/g, '&quot;')

      .replace(/'/g, '&#39;')

      .replace(/</g, '&lt;')

      .replace(/>/g, '&gt;');

  }



  escapeHtml(str) {

    if (str == null) return '';

    return String(str)

      .replace(/&/g, '&amp;')

      .replace(/</g, '&lt;')

      .replace(/>/g, '&gt;')

      .replace(/"/g, '&quot;')

      .replace(/'/g, '&#39;')

      .replace(/\n/g, '<br>');

  }



  // Actions

  switchTab(tabName) {

    this.state.activeTab = tabName;

    if (tabName === 'pickup') {

      this.state.printTargetSheet = 'pickup';

    } else if (tabName === 'pad') {

      this.state.printTargetSheet = 'pad';

    }

    this.render();

    this.bindEvents();

    if (window.app && typeof window.app.updateDocumentTitle === 'function') {

      window.app.updateDocumentTitle();

    }

  }



  sendDailyRowToDoctor(rowIdx) {

    const row = this.state.rows[rowIdx];

    if (!row || !(row.name || '').trim()) {

      alert('Please enter a patient name before sending to the doctor.');

      return;

    }



    const orderId = row.orderId || `cl_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    row.orderId = orderId;

    row.status = 'pending_doctor';



    const existingIdx = this.state.allOrders.findIndex(o => o.id === orderId);

    const orderData = {

      id: orderId,

      dateOrdered: this.state.batchDate,

      patient: row.name.trim(),

      patientNotes: row.instructions.trim() ? `"${row.instructions.trim()}"` : '',

      phone: row.phone.trim(),

      dob: row.dob.trim(),

      brand: '',

      rxRight: '',

      qtyRight: '1',

      rxLeft: '',

      qtyLeft: '1',

      amtDue: 'trials',

      paid: '-',

      dateReceived: '',

      drawer: '',

      dateCalled: '',

      status: 'pending_doctor',

      doctorOrdered: false,

      boxesRequested: row.boxes.trim(),

      frontInstructions: row.instructions.trim(),

      updatedAt: new Date().toISOString()

    };



    if (existingIdx !== -1) {

      this.state.allOrders[existingIdx] = { ...this.state.allOrders[existingIdx], ...orderData };

    } else {

      this.state.allOrders.unshift(orderData);

    }



    this.notifyChange();

    this.render();

    this.bindEvents();

    alert(`✅ Order for ${row.name.trim()} sent to Doctor's Ordering Queue! The Doctor can now open this on her computer, enter the Rx, and mark it ordered.`);

  }



  sendAllFilledToDoctor() {

    const filledIndices = this.state.rows

      .map((r, i) => ((r.name || '').trim() ? i : -1))

      .filter(i => i !== -1);



    if (filledIndices.length === 0) {

      alert('No patient orders entered on the sheet yet.');

      return;

    }



    let count = 0;

    filledIndices.forEach(idx => {

      const row = this.state.rows[idx];

      const orderId = row.orderId || `cl_order_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`;

      row.orderId = orderId;

      row.status = 'pending_doctor';



      const existingIdx = this.state.allOrders.findIndex(o => o.id === orderId);

      const orderData = {

        id: orderId,

        dateOrdered: this.state.batchDate,

        patient: row.name.trim(),

        patientNotes: row.instructions.trim() ? `"${row.instructions.trim()}"` : '',

        phone: row.phone.trim(),

        dob: row.dob.trim(),

        brand: '',

        rxRight: '',

        qtyRight: '1',

        rxLeft: '',

        qtyLeft: '1',

        amtDue: 'trials',

        paid: '-',

        dateReceived: '',

        drawer: '',

        dateCalled: '',

        status: 'pending_doctor',

        doctorOrdered: false,

        boxesRequested: row.boxes.trim(),

        frontInstructions: row.instructions.trim(),

        updatedAt: new Date().toISOString()

      };



      if (existingIdx !== -1) {

        this.state.allOrders[existingIdx] = { ...this.state.allOrders[existingIdx], ...orderData };

      } else {

        this.state.allOrders.unshift(orderData);

      }

      count++;

    });



    this.notifyChange();

    this.render();

    this.bindEvents();

    alert(`✅ ${count} orders sent to Doctor's Ordering Queue! Doctor can now enter the Rx on her computer.`);

  }



  openDoctorOrderModal(orderId) {

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    this.state.activeDoctorModalOrder = JSON.parse(JSON.stringify(order));

    this.render();

    this.bindEvents();

  }



  closeDoctorOrderModal() {

    this.state.activeDoctorModalOrder = null;

    this.render();

    this.bindEvents();

  }



  submitDoctorOrder() {

    const m = this.state.activeDoctorModalOrder;

    if (!m) return;



    if (!m.brand || !m.brand.trim()) {

      alert('Please specify the Contact Lens Brand.');

      return;

    }



    const idx = this.state.allOrders.findIndex(o => o.id === m.id);

    const updatedOrder = {

      ...m,

      doctorOrdered: true,

      doctorOrderedAt: new Date().toLocaleDateString('en-US'),

      status: m.status === 'pending_doctor' ? 'ordered' : m.status,

      updatedAt: new Date().toISOString()

    };



    if (idx !== -1) {

      this.state.allOrders[idx] = updatedOrder;

    } else {

      this.state.allOrders.unshift(updatedOrder);

    }



    // Also update corresponding daily pad row status if linked

    this.state.rows.forEach(r => {

      if (r.orderId === m.id) {

        r.status = 'ordered';

      }

    });



    this.state.activeDoctorModalOrder = null;

    this.notifyChange();

    this.render();

    this.bindEvents();

    alert(`🎉 Success! Contacts for ${m.patient} marked as ORDERED with Rx recorded. Patient is now listed on the 50-row Waiting to be Picked Up Sheet!`);

  }



  updatePickupField(orderId, field, val) {

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    order[field] = val;

    order.updatedAt = new Date().toISOString();



    // Auto update status based on fields

    if (field === 'dateReceived' && val.trim()) {

      if (order.status === 'ordered') order.status = 'received';

    }

    if (field === 'dateCalled' && val.trim()) {

      order.status = 'called';

    }



    this.notifyChange();

  }



  markOrderReceivedToday(orderId) {

    const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    order.dateReceived = today;

    order.status = 'received';

    order.updatedAt = new Date().toISOString();

    this.notifyChange();

    this.render();

    this.bindEvents();

  }



  markOrderCalledToday(orderId) {

    const today = new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    order.dateCalled = today;

    order.status = 'called';

    order.updatedAt = new Date().toISOString();

    this.notifyChange();

    this.render();

    this.bindEvents();

  }



  markOrderLvm(orderId) {

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    order.dateCalled = 'LVM';

    order.status = 'called';

    order.updatedAt = new Date().toISOString();

    this.notifyChange();

    this.render();

    this.bindEvents();

  }



  markOrderCompleted(orderId) {

    const order = this.state.allOrders.find(o => o.id === orderId);

    if (!order) return;

    if (confirm(`Mark contacts for ${order.patient} as PICKED UP / COMPLETED? This will archive the order to past history.`)) {

      order.status = 'completed';

      order.updatedAt = new Date().toISOString();

      this.notifyChange();

      this.render();

      this.bindEvents();

    }

  }



  printDailySheet() {

    this.state.printTargetSheet = 'pad';

    this.state.forceBlankPrint = false;

    document.body.classList.remove('print-blank-active');

    document.body.classList.remove('printing-pickup-sheet');

    document.body.classList.add('printing-daily-pad');

    window.print();

    setTimeout(() => {

      document.body.classList.remove('printing-daily-pad');

    }, 500);

  }



  printBlankDailySheet() {

    this.state.printTargetSheet = 'pad';

    this.state.forceBlankPrint = true;

    document.body.classList.add('print-blank-active');

    document.body.classList.remove('printing-pickup-sheet');

    document.body.classList.add('printing-daily-pad');



    const sheetEl = this.container.querySelector('#clo-interactive-sheet');

    if (sheetEl) sheetEl.classList.add('clo-force-blank');



    window.print();



    setTimeout(() => {

      this.state.forceBlankPrint = false;

      document.body.classList.remove('print-blank-active');

      document.body.classList.remove('printing-daily-pad');

      if (sheetEl) sheetEl.classList.remove('clo-force-blank');

    }, 500);

  }



  printPickupSheet() {

    this.state.printTargetSheet = 'pickup';

    this.state.forceBlankPrint = false;

    document.body.classList.remove('print-blank-active');

    document.body.classList.remove('printing-daily-pad');

    document.body.classList.add('printing-pickup-sheet');

    window.print();

    setTimeout(() => {

      document.body.classList.remove('printing-pickup-sheet');

    }, 500);

  }



  printBlankPickupSheet() {

    this.state.printTargetSheet = 'pickup';

    this.state.forceBlankPrint = true;

    document.body.classList.add('print-blank-active');

    document.body.classList.remove('printing-daily-pad');

    document.body.classList.add('printing-pickup-sheet');



    const sheetEl = this.container.querySelector('#cl-pickup-sheet-table');

    if (sheetEl) sheetEl.classList.add('clo-force-blank');



    window.print();



    setTimeout(() => {

      this.state.forceBlankPrint = false;

      document.body.classList.remove('print-blank-active');

      document.body.classList.remove('printing-pickup-sheet');

      if (sheetEl) sheetEl.classList.remove('clo-force-blank');

    }, 500);

  }



  reset() {

    if (confirm('Start a fresh order sheet? This will clear the 16 rows on today\'s pad. All past doctor orders and pickup history remain safely preserved in the database!')) {

      const todayStr = new Date().toLocaleDateString('en-US', {

        month: '2-digit',

        day: '2-digit',

        year: 'numeric'

      });



      this.state.batchDate = todayStr;

      this.state.rows = Array.from({ length: 16 }, (_, i) => ({

        id: i + 1,

        name: '',

        dob: '',

        phone: '',

        boxes: '',

        instructions: '',

        status: 'pending_doctor',

        orderId: null

      }));

      this.state.quickName = '';

      this.state.quickDob = '';

      this.state.quickPhone = '';

      this.state.quickBoxes = '';

      this.state.quickInstructions = '';



      this.notifyChange();

      this.render();

      this.bindEvents();

    }

  }



  render() {

    const pendingDoctorOrders = this.getPendingDoctorOrders();

    const waitingOrders = this.getWaitingOrders();

    const completedOrders = this.getCompletedOrders();



    const filledPadCount = this.state.rows.filter(r => (r?.name || '').trim().length > 0).length;



    this.container.innerHTML = `

      <div class="clo-main-container">



        <!-- TOP NAVIGATION TABS (Screen only) -->

        <div class="clo-top-nav no-print">

          <div class="clo-tabs">

            <button type="button" class="clo-tab-btn ${this.state.activeTab === 'pad' ? 'active' : ''}" data-tab="pad">

              <span class="clo-tab-icon">📋</span>

              <span class="clo-tab-text">Daily Orders Pad (16 Rows)</span>

              ${filledPadCount > 0 ? `<span class="clo-tab-badge badge-blue">${filledPadCount}</span>` : ''}

            </button>



            <button type="button" class="clo-tab-btn ${this.state.activeTab === 'doctor' ? 'active' : ''}" data-tab="doctor">

              <span class="clo-tab-icon">🩺</span>

              <span class="clo-tab-text">Doctor's Ordering Queue</span>

              ${pendingDoctorOrders.length > 0 ? `<span class="clo-tab-badge badge-amber">${pendingDoctorOrders.length} Pending</span>` : ''}

            </button>



            <button type="button" class="clo-tab-btn ${this.state.activeTab === 'pickup' ? 'active' : ''}" data-tab="pickup">

              <span class="clo-tab-icon">📦</span>

              <span class="clo-tab-text">Waiting to be Picked Up (50 Rows)</span>

              ${waitingOrders.length > 0 ? `<span class="clo-tab-badge badge-green">${waitingOrders.length} Waiting</span>` : ''}

            </button>



            <button type="button" class="clo-tab-btn ${this.state.activeTab === 'history' ? 'active' : ''}" data-tab="history">

              <span class="clo-tab-icon">🔍</span>

              <span class="clo-tab-text">Search Past Order History</span>

              <span class="clo-tab-badge badge-gray">${this.state.allOrders.length}</span>

            </button>

          </div>



          <!-- Multi-Computer Cloud Sync Indicator -->

          <div class="clo-sync-indicator" title="Automatic multi-computer synchronization across office network">

            <span class="clo-sync-dot ${this.state.syncStatus === 'synced' ? 'dot-green' : 'dot-blue'}"></span>

            <span class="clo-sync-label">

              ${this.state.syncStatus === 'syncing' ? 'Syncing...' : (this.state.lastSyncedAt ? `Synced ${this.state.lastSyncedAt}` : 'Office Cloud Synced')}

            </span>

          </div>

        </div>



        <!-- ======================================================== -->

        <!-- TAB 1: DAILY ORDERS PAD (16 ROWS)                        -->

        <!-- ======================================================== -->

        <div class="clo-tab-content ${this.state.activeTab === 'pad' ? 'active-tab-content' : 'hidden-tab-content'} ${this.state.printTargetSheet === 'pad' ? 'printable-tab-content' : 'non-printable-tab'}">

          

          <!-- Bento Box Toolbar (Screen only) -->

          <div class="bento-dock no-print">

            

            <div class="bento-dock-card bento-hero-card">

              <div class="bento-hero-left">

                <div class="bento-lens-icon">

                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>

                </div>

                <div>

                  <div class="bento-pill-row">

                    <span class="bento-pill bento-pill-dark">Landscape 16-Row Pad</span>

                    <span class="bento-pill ${filledPadCount > 0 ? 'bento-pill-green' : 'bento-pill-gray'}">

                      📦 ${filledPadCount} of 16 Orders Filled

                    </span>

                    <span class="bento-pill bento-pill-outline">${this.state.batchDate}</span>

                  </div>

                  <h2 class="bento-title">Contact Lens Orders (Daily Pad)</h2>

                  <p class="bento-subtitle">Type directly into the 16 rows below. When filled, send to the Doctor's Queue so she can order and input the Rx on her computer.</p>

                </div>

              </div>



              <div class="bento-hero-actions">

                <button type="button" class="clo-btn clo-btn-primary" id="btn-print-pad-filled" title="Print this daily sheet">

                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>

                  <span>Print Completed Sheet (${filledPadCount})</span>

                </button>



                <button type="button" class="clo-btn clo-btn-secondary" id="btn-print-pad-blank" title="Print 100% blank template pad">

                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>

                  <span>Print Blank Pad</span>

                </button>



                <button type="button" class="clo-btn clo-btn-accent" id="btn-send-all-doctor" title="Send all filled rows to Doctor for Ordering">

                  <span>🩺 Send Batch to Doctor (${filledPadCount})</span>

                </button>



                <button type="button" class="clo-btn clo-btn-subtle" id="btn-clear-daily-pad" title="Start new day">

                  <span>Start New Day</span>

                </button>

              </div>

            </div>



            <!-- Bento Subgrid: Quick Add + Doctor Sticky Memo -->

            <div class="bento-subgrid">

              

              <div class="bento-dock-card bento-quick-card">

                <div class="bento-card-header">

                  <h3>Quick Add Patient Order</h3>

                  <span class="bento-card-tag">Inserts into next empty row on 16-row pad</span>

                </div>

                

                <div class="bento-quick-inputs">

                  <input type="text" id="quick-input-name" class="bento-input" placeholder="Patient Name">

                  <input type="text" id="quick-input-dob" class="bento-input" placeholder="DOB (MM/DD/YYYY)" style="max-width: 130px;">

                  <input type="text" id="quick-input-phone" class="bento-input" placeholder="Phone (859) 000-0000" style="max-width: 155px;">

                  <input type="text" id="quick-input-boxes" class="bento-input" placeholder="Number of Boxes" style="max-width: 180px;">

                  <input type="text" id="quick-input-instructions" class="bento-input" placeholder="Billing & Special Instructions">

                  <button type="button" class="clo-btn clo-btn-primary" id="btn-quick-add" style="white-space: nowrap;">

                    + Add to Pad

                  </button>

                </div>



                <!-- PRE-FILL AMOUNT OPTIONS: X Boxes, X Boxes Each, Six Month Supply, Annual Supply -->

                <div class="bento-builder-row">

                  <div class="bento-builder-group">

                    <span class="chip-label">Pre-Fill Amount:</span>

                    <div class="bento-qty-spinner-wrap">

                      <span class="qty-label">Qty X:</span>

                      <input type="number" id="quick-qty-num" class="bento-qty-num" value="1" min="1" max="99">

                    </div>

                    <button type="button" class="bento-chip bento-chip-calc" id="btn-qty-boxes" title="Sets [X] Boxes">

                      <span id="label-qty-boxes">1 Box</span>

                    </button>

                    <button type="button" class="bento-chip bento-chip-calc" id="btn-qty-boxes-each" title="Sets [X] Boxes Each">

                      <span id="label-qty-boxes-each">1 Box Each</span>

                    </button>

                    <button type="button" class="bento-chip" data-quick-box="Six Month Supply">Six Month Supply</button>

                    <button type="button" class="bento-chip" data-quick-box="Annual Supply">Annual Supply</button>

                  </div>

                </div>



                <!-- BILLING OPTIONS: Self Pay, Eyemed, VSP, Spectera, Versant, Premier Vision, Other -->

                <div class="bento-builder-row">

                  <div class="bento-builder-group">

                    <span class="chip-label">Billing:</span>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Self Pay">Self Pay</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Eyemed">Eyemed</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="VSP">VSP</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Spectera">Spectera</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Versant">Versant</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Premier Vision">Premier Vision</button>

                    <button type="button" class="bento-chip chip-billing" data-quick-billing="Other">Other</button>

                  </div>

                </div>



                <!-- CHECKMARK BOX FOR SPECIAL INSTRUCTIONS & ALLOWANCE -->

                <div class="bento-allowance-toggle-row">

                  <label class="bento-check-label">

                    <input type="checkbox" id="chk-special-instructions-toggle">

                    <span class="font-bold">Add Special Instructions / Allowance Details for Doctor</span>

                  </label>



                  <div class="bento-allowance-details" id="bento-allowance-details" style="display: none;">

                    <div class="allowance-helper-text">

                      Let doctor know remaining insurance allowance or special instructions:

                    </div>

                    <div class="bento-chip-row" style="margin-top: 4px;">

                      <button type="button" class="bento-chip chip-allowance-preset" data-allowance="Only $50 allowance left from original $250">

                        ⚡ "Only $50 allowance left from original $250"

                      </button>

                      <button type="button" class="bento-chip chip-allowance-preset" data-allowance="Materials allowance only remaining">

                        "Materials allowance only"

                      </button>

                      <button type="button" class="bento-chip chip-allowance-preset" data-allowance="Insurance used already, Self pay">

                        "Insurance used already, Self pay"

                      </button>

                      <button type="button" class="bento-chip chip-allowance-preset" data-allowance="Dr. Robbins trial fit only">

                        "Dr. Robbins trial fit only"

                      </button>

                    </div>

                    <div class="allowance-custom-calc-row">

                      <span class="text-xs text-slate-500">Custom allowance: Only $</span>

                      <input type="text" id="custom-allowance-rem" class="bento-mini-input" placeholder="50" style="width: 55px;">

                      <span class="text-xs text-slate-500">left of original $</span>

                      <input type="text" id="custom-allowance-orig" class="bento-mini-input" placeholder="250" style="width: 55px;">

                      <button type="button" class="bento-chip bento-chip-calc" id="btn-apply-custom-allowance">

                        + Apply Allowance

                      </button>

                    </div>

                  </div>

                </div>



              </div>



              <div class="bento-dock-card bento-memo-card">

                <div class="bento-memo-badge">

                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>

                  <span>Dr. Robbins Note</span>

                </div>

                <div class="bento-memo-quote">

                  "*GET PT EMAIL IF MAILING CONTACTS*"

                </div>

                <p class="bento-memo-sub">

                  If patient requests contacts mailed directly to home, record their email for carrier delivery tracking.

                </p>

              </div>



            </div>

          </div>



          <!-- THE PHYSICAL 16-ROW SHEET CANVAS (Exact Replica) -->

          <div class="clo-sheet-canvas-wrapper">

            <div class="clo-sheet-canvas" id="clo-interactive-sheet">

              

              <!-- Exact Title: ArialMT 48pt Font -->

              <h1 class="clo-title-header">CONTACT LENS ORDERS</h1>



              <!-- Exact 5-Column Table: Arial-BoldMT 11pt Headers -->

              <table class="clo-table">

                <thead>

                  <tr>

                    <th class="clo-th-name">NAME</th>

                    <th class="clo-th-dob">DATE OF BIRTH</th>

                    <th class="clo-th-phone">PHONE NUMBER</th>

                    <th class="clo-th-boxes">NUMBER OF BOXES</th>

                    <th class="clo-th-instructions">

                      INSURANCE USED?<br>SPECIAL INSTRUCTIONS

                    </th>

                  </tr>

                </thead>

                <tbody>

                  ${this.state.rows.map((row, idx) => `

                    <tr class="clo-table-row" data-row-idx="${idx}">

                      

                      <!-- 1. NAME -->

                      <td class="clo-td-name">

                        <div class="clo-cell-wrapper">

                          <input 

                            type="text" 

                            class="clo-input clo-input-name" 

                            data-row="${idx}" 

                            data-field="name" 

                            placeholder="" 

                            value="${this.escapeAttr(row.name)}"

                            autocomplete="off"

                            spellcheck="false"

                          >

                          ${(row.name || '').trim() ? `

                            <button type="button" class="clo-row-doctor-btn no-print" data-row-idx="${idx}" title="${row.status === 'ordered' ? 'Already Ordered by Doctor' : 'Send to Doctor for Ordering'}">

                              ${row.status === 'ordered' ? '✅ Ordered' : '🩺 Order'}

                            </button>

                          ` : ''}

                        </div>

                      </td>



                      <!-- 2. DATE OF BIRTH -->

                      <td class="clo-td-dob">

                        <input 

                          type="text" 

                          class="clo-input clo-input-dob" 

                          data-row="${idx}" 

                          data-field="dob" 

                          placeholder="" 

                          value="${this.escapeAttr(row.dob)}"

                          autocomplete="off"

                        >

                      </td>



                      <!-- 3. PHONE NUMBER -->

                      <td class="clo-td-phone">

                        <input 

                          type="text" 

                          class="clo-input clo-input-phone" 

                          data-row="${idx}" 

                          data-field="phone" 

                          placeholder="" 

                          value="${this.escapeAttr(row.phone)}"

                          autocomplete="off"

                        >

                      </td>



                      <!-- 4. NUMBER OF BOXES -->

                      <td class="clo-td-boxes">

                        <input 

                          type="text" 

                          class="clo-input clo-input-boxes" 

                          data-row="${idx}" 

                          data-field="boxes" 

                          placeholder="" 

                          value="${this.escapeAttr(row.boxes)}"

                          autocomplete="off"

                        >

                      </td>



                      <!-- 5. INSURANCE / SPECIAL INSTRUCTIONS -->

                      <td class="clo-td-instructions">

                        <input 

                          type="text" 

                          class="clo-input clo-input-instructions" 

                          data-row="${idx}" 

                          data-field="instructions" 

                          placeholder="" 

                          value="${this.escapeAttr(row.instructions)}"

                          autocomplete="off"

                        >

                      </td>



                    </tr>

                  `).join('')}

                </tbody>

              </table>



            </div>

          </div>

        </div>





        <!-- ======================================================== -->

        <!-- TAB 2: DOCTOR'S ORDERING QUEUE                           -->

        <!-- ======================================================== -->

        <div class="clo-tab-content ${this.state.activeTab === 'doctor' ? 'active-tab-content' : 'hidden-tab-content'} non-printable-tab">

          

          <div class="bento-dock no-print">

            <div class="bento-dock-card bento-hero-card" style="border-left-color: #f59e0b;">

              <div class="bento-hero-left">

                <div class="bento-lens-icon" style="background: #d97706;">

                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>

                </div>

                <div>

                  <div class="bento-pill-row">

                    <span class="bento-pill bento-pill-dark">Doctor Station</span>

                    <span class="bento-pill ${pendingDoctorOrders.length > 0 ? 'bento-pill-green' : 'bento-pill-gray'}">

                      🩺 ${pendingDoctorOrders.length} Orders Awaiting Doctor

                    </span>

                    <span class="bento-pill bento-pill-outline">Multi-Computer Linked</span>

                  </div>

                  <h2 class="bento-title">Doctor's Contact Lens Ordering Station</h2>

                  <p class="bento-subtitle">When the front desk enters contact orders, they appear here. The doctor clicks "Order & Enter Rx" to record the contact lens prescription and send it immediately to the Waiting to be Picked Up sheet.</p>

                </div>

              </div>



              <div class="bento-hero-actions">

                <button type="button" class="clo-btn clo-btn-primary" id="btn-manual-doctor-order">

                  <span>+ New Direct Doctor Order</span>

                </button>

              </div>

            </div>

          </div>



          <!-- Doctor Queue Cards -->

          <div class="clo-doctor-queue-container no-print">

            ${pendingDoctorOrders.length === 0 ? `

              <div class="clo-empty-queue-card">

                <div class="clo-empty-icon">🎉</div>

                <h3>All Contact Orders Have Been Ordered!</h3>

                <p>No orders are currently waiting for the doctor. Any new contact orders entered by the front desk will appear here automatically in real time.</p>

                <button type="button" class="clo-btn clo-btn-secondary" id="btn-switch-to-pickup-from-doc">

                  <span>View Waiting to be Picked Up Sheet (50 Rows) →</span>

                </button>

              </div>

            ` : `

              <div class="clo-queue-grid">

                ${pendingDoctorOrders.map(order => `

                  <div class="clo-queue-card">

                    <div class="clo-queue-card-top">

                      <div class="clo-queue-patient">

                        <h4>${this.escapeHtml(order.patient)}</h4>

                        <span class="clo-queue-dob">DOB: ${order.dob || 'N/A'}</span>

                      </div>

                      <span class="clo-queue-status-tag">Needs Doctor Ordering</span>

                    </div>



                    <div class="clo-queue-details">

                      <div class="clo-q-row">

                        <span class="clo-q-label">Date Requested:</span>

                        <span class="clo-q-val">${order.dateOrdered || this.state.batchDate}</span>

                      </div>

                      <div class="clo-q-row">

                        <span class="clo-q-label">Phone:</span>

                        <span class="clo-q-val">${order.phone || 'N/A'}</span>

                      </div>

                      <div class="clo-q-row">

                        <span class="clo-q-label">Requested Boxes:</span>

                        <span class="clo-q-val font-semibold">${order.boxesRequested || '1 box each'}</span>

                      </div>

                      ${order.frontInstructions ? `

                        <div class="clo-q-row">

                          <span class="clo-q-label">Front Notes:</span>

                          <span class="clo-q-val italic">${this.escapeHtml(order.frontInstructions)}</span>

                        </div>

                      ` : ''}

                    </div>



                    <div class="clo-queue-card-footer">

                      <button type="button" class="clo-btn clo-btn-accent btn-open-doctor-modal" data-order-id="${order.id}">

                        <span>🩺 Order Contacts & Enter Rx →</span>

                      </button>

                    </div>

                  </div>

                `).join('')}

              </div>

            `}

          </div>



        </div>





        <!-- ======================================================== -->

        <!-- TAB 3: WAITING TO BE PICKED UP (50-ROW EXACT REPLICA)    -->

        <!-- ======================================================== -->

        <div class="clo-tab-content ${this.state.activeTab === 'pickup' ? 'active-tab-content' : 'hidden-tab-content'} ${this.state.printTargetSheet === 'pickup' ? 'printable-tab-content' : 'non-printable-tab'}">

          

          <!-- Bento Toolbar (Screen only) -->

          <div class="bento-dock no-print">

            <div class="bento-dock-card bento-hero-card" style="border-left-color: #10b981;">

              <div class="bento-hero-left">

                <div class="bento-lens-icon" style="background: #059669;">

                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>

                </div>

                <div>

                  <div class="bento-pill-row">

                    <span class="bento-pill bento-pill-dark">50-Row Physical Sheet Replica</span>

                    <span class="bento-pill bento-pill-green">

                      📦 ${waitingOrders.length} Waiting for Pickup

                    </span>

                    <span class="bento-pill bento-pill-outline">Landscape 11" x 8.5"</span>

                  </div>

                  <h2 class="bento-title">Contact Lens Orders - Waiting to be Picked Up</h2>

                  <p class="bento-subtitle">Replica of the front desk tracking sheet. When contacts arrive, record Date Received & Drawer number. Call the patient, enter Date Called (or LVM), and print for physical tracking.</p>

                </div>

              </div>



              <div class="bento-hero-actions">

                <button type="button" class="clo-btn clo-btn-primary" id="btn-print-pickup-filled" title="Print this tracking sheet exactly like the uploaded image">

                  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>

                  <span>Print Waiting Sheet (${waitingOrders.length})</span>

                </button>



                <button type="button" class="clo-btn clo-btn-secondary" id="btn-print-pickup-blank" title="Print a 100% blank 50-row grid sheet">

                  <span>Print Blank 50-Row Pad</span>

                </button>



                <button type="button" class="clo-btn clo-btn-ghost" id="btn-add-manual-pickup-row">

                  <span>+ Add Row Manually</span>

                </button>

              </div>

            </div>

          </div>



          <!-- THE PHYSICAL 50-ROW SHEET CANVAS (EXACT MATCH TO PHOTO) -->

          <div class="clo-pickup-sheet-wrapper">

            <div class="clo-pickup-sheet-canvas">

              

              <table class="cl-pickup-sheet-table" id="cl-pickup-sheet-table">

                <thead>

                  <tr>

                    <th class="col-date-ordered">Date Ordered</th>

                    <th class="col-patient">Patient</th>

                    <th class="col-phone">Phone</th>

                    <th class="col-brand">CL Brand</th>

                    <th class="col-rx-r">Rx (right)</th>

                    <th class="col-qty-r">#</th>

                    <th class="col-rx-l">Rx (left)</th>

                    <th class="col-qty-l">#</th>

                    <th class="col-amt">Amt Due</th>

                    <th class="col-pd">Pd?</th>

                    <th class="col-received">Date Recieved</th>

                    <th class="col-drawer">Drawer</th>

                    <th class="col-called">Date Called</th>

                  </tr>

                </thead>

                <tbody>

                  ${this.renderPickupRows(waitingOrders)}

                </tbody>

              </table>



            </div>

          </div>



        </div>





        <!-- ======================================================== -->

        <!-- TAB 4: SEARCH PAST ORDER HISTORY                         -->

        <!-- ======================================================== -->

        <div class="clo-tab-content ${this.state.activeTab === 'history' ? 'active-tab-content' : 'hidden-tab-content'} non-printable-tab">

          

          <div class="bento-dock no-print">

            <div class="bento-dock-card bento-hero-card" style="border-left-color: #6366f1;">

              <div class="bento-hero-left">

                <div class="bento-lens-icon" style="background: #4f46e5;">

                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

                </div>

                <div>

                  <div class="bento-pill-row">

                    <span class="bento-pill bento-pill-dark">Search Master Database</span>

                    <span class="bento-pill bento-pill-outline">${this.state.allOrders.length} Total Orders Recorded</span>

                  </div>

                  <h2 class="bento-title">Search Past History of Contact Lens Orders</h2>

                  <p class="bento-subtitle">Search any past patient by name, phone number, date ordered, brand, or drawer number across the entire practice history.</p>

                </div>

              </div>

            </div>



            <!-- Search Bar & Filters -->

            <div class="clo-history-search-bar-card">

              <div class="clo-search-input-wrap">

                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

                <input 

                  type="text" 

                  id="clo-history-search-input" 

                  class="clo-search-field" 

                  placeholder="Search by Patient Name, Phone, Brand, Date, Drawer #..." 

                  value="${this.escapeAttr(this.state.searchQuery)}"

                  autocomplete="off"

                >

                ${this.state.searchQuery ? `

                  <button type="button" class="clo-clear-search-btn" id="btn-clear-search">✕</button>

                ` : ''}

              </div>



              <div class="clo-filter-pills">

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'all' ? 'active' : ''}" data-filter="all">All Orders (${this.state.allOrders.length})</button>

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'pending' ? 'active' : ''}" data-filter="pending">Pending Doctor (${pendingDoctorOrders.length})</button>

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'ordered' ? 'active' : ''}" data-filter="ordered">In Transit (${this.state.allOrders.filter(o => o.status === 'ordered').length})</button>

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'received' ? 'active' : ''}" data-filter="received">In Drawer (${this.state.allOrders.filter(o => o.status === 'received').length})</button>

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'called' ? 'active' : ''}" data-filter="called">Called / LVM (${this.state.allOrders.filter(o => o.status === 'called').length})</button>

                <button type="button" class="clo-filter-pill ${this.state.historyFilter === 'completed' ? 'active' : ''}" data-filter="completed">Picked Up (${completedOrders.length})</button>

              </div>

            </div>

          </div>



          <!-- History Results Table -->

          <div class="clo-history-table-container no-print">

            ${this.renderHistoryTable()}

          </div>



        </div>



        <!-- ======================================================== -->

        <!-- DOCTOR ORDER & RX ENTRY MODAL DIALOG                     -->

        <!-- ======================================================== -->

        ${this.state.activeDoctorModalOrder ? this.renderDoctorOrderModal() : ''}



      </div>

    `;

  }



  // Render exactly 50 rows for Waiting to be Picked Up sheet

  renderPickupRows(waitingOrders) {

    const totalRowsNeeded = 50;

    const rowsHtml = [];



    for (let i = 0; i < totalRowsNeeded; i++) {

      const order = waitingOrders[i] || null;



      if (order) {

        rowsHtml.push(`

          <tr class="cl-pickup-row" data-order-id="${order.id}">

            

            <!-- 1. Date Ordered -->

            <td class="col-date-ordered">${this.escapeHtml(order.dateOrdered)}</td>



            <!-- 2. Patient Name & Notes below -->

            <td class="col-patient">

              <div class="patient-cell-content">

                <span class="patient-name">${this.escapeHtml(order.patient)}</span>

                ${order.patientNotes ? `<span class="patient-note">${this.escapeHtml(order.patientNotes)}</span>` : ''}

              </div>

            </td>



            <!-- 3. Phone -->

            <td class="col-phone">

              <div class="phone-cell-content">

                ${this.escapeHtml(order.phone)}

              </div>

            </td>



            <!-- 4. CL Brand -->

            <td class="col-brand">

              <div class="brand-cell-content">

                ${this.escapeHtml(order.brand)}

              </div>

            </td>



            <!-- 5. Rx (right) -->

            <td class="col-rx-r">${this.escapeHtml(order.rxRight)}</td>



            <!-- 6. # (qty right) -->

            <td class="col-qty-r">${this.escapeHtml(order.qtyRight || '1')}</td>



            <!-- 7. Rx (left) -->

            <td class="col-rx-l">${this.escapeHtml(order.rxLeft)}</td>



            <!-- 8. # (qty left) -->

            <td class="col-qty-l">${this.escapeHtml(order.qtyLeft || '1')}</td>



            <!-- 9. Amt Due -->

            <td class="col-amt">${this.escapeHtml(order.amtDue || 'trials')}</td>



            <!-- 10. Pd? -->

            <td class="col-pd">${this.escapeHtml(order.paid || '-')}</td>



            <!-- 11. Date Recieved (Editable input on screen) -->

            <td class="col-received">

              <div class="pickup-edit-cell">

                <input 

                  type="text" 

                  class="pickup-cell-input input-received" 

                  data-order-id="${order.id}" 

                  data-field="dateReceived" 

                  value="${this.escapeAttr(order.dateReceived)}" 

                  placeholder="MM/DD/YYYY"

                >

                <button type="button" class="btn-quick-date no-print" data-action="received-today" data-order-id="${order.id}" title="Set Received Today">📅</button>

              </div>

            </td>



            <!-- 12. Drawer -->

            <td class="col-drawer">

              <input 

                type="text" 

                class="pickup-cell-input input-drawer" 

                data-order-id="${order.id}" 

                data-field="drawer" 

                value="${this.escapeAttr(order.drawer)}" 

                placeholder="#"

              >

            </td>



            <!-- 13. Date Called (Editable input on screen) -->

            <td class="col-called">

              <div class="pickup-edit-cell">

                <input 

                  type="text" 

                  class="pickup-cell-input input-called" 

                  data-order-id="${order.id}" 

                  data-field="dateCalled" 

                  value="${this.escapeAttr(order.dateCalled)}" 

                  placeholder="MM/DD/YYYY or LVM"

                >

                <div class="pickup-row-actions no-print">

                  <button type="button" class="btn-quick-call" data-action="called-today" data-order-id="${order.id}" title="Set Called Today">📞</button>

                  <button type="button" class="btn-quick-lvm" data-action="called-lvm" data-order-id="${order.id}" title="Set Left Voicemail">LVM</button>

                  <button type="button" class="btn-quick-archive" data-action="complete-pickup" data-order-id="${order.id}" title="Mark Picked Up">✓</button>

                </div>

              </div>

            </td>



          </tr>

        `);

      } else {

        // Blank row up to 50

        rowsHtml.push(`

          <tr class="cl-pickup-row cl-pickup-blank-row">

            <td class="col-date-ordered">&nbsp;</td>

            <td class="col-patient">&nbsp;</td>

            <td class="col-phone">&nbsp;</td>

            <td class="col-brand">&nbsp;</td>

            <td class="col-rx-r">&nbsp;</td>

            <td class="col-qty-r">&nbsp;</td>

            <td class="col-rx-l">&nbsp;</td>

            <td class="col-qty-l">&nbsp;</td>

            <td class="col-amt">&nbsp;</td>

            <td class="col-pd">&nbsp;</td>

            <td class="col-received">&nbsp;</td>

            <td class="col-drawer">&nbsp;</td>

            <td class="col-called">&nbsp;</td>

          </tr>

        `);

      }

    }



    return rowsHtml.join('');

  }



  // Render Doctor Order & Rx Entry Modal

  renderDoctorOrderModal() {

    const o = this.state.activeDoctorModalOrder;

    if (!o) return '';



    return `

      <div class="clo-modal-backdrop" id="doctor-rx-modal">

        <div class="clo-modal-card">

          

          <div class="clo-modal-header">

            <div class="clo-modal-header-left">

              <span class="clo-modal-badge">🩺 Doctor Prescription & Order Entry</span>

              <h2>Order Contacts: ${this.escapeHtml(o.patient)}</h2>

              <p>Enter the patient's contact lens brand, prescription, and quantities to submit the order and add to the Waiting to be Picked Up sheet.</p>

            </div>

            <button type="button" class="clo-modal-close-btn" id="btn-close-doctor-modal">✕</button>

          </div>



          <div class="clo-modal-body">

            

            <!-- Patient Banner -->

            <div class="clo-modal-patient-banner">

              <div class="banner-item">

                <span class="lbl">Patient:</span>

                <span class="val font-bold">${this.escapeHtml(o.patient)}</span>

              </div>

              <div class="banner-item">

                <span class="lbl">DOB:</span>

                <span class="val">${o.dob || 'N/A'}</span>

              </div>

              <div class="banner-item">

                <span class="lbl">Phone:</span>

                <span class="val">${o.phone || 'N/A'}</span>

              </div>

              <div class="banner-item">

                <span class="lbl">Date Requested:</span>

                <span class="val">${o.dateOrdered || this.state.batchDate}</span>

              </div>

              <div class="banner-item">

                <span class="lbl">Boxes:</span>

                <span class="val font-semibold">${o.boxesRequested || '1 box each'}</span>

              </div>

            </div>



            <!-- Form Inputs -->

            <div class="clo-modal-form-grid">

              

              <!-- CL Brand -->

              <div class="clo-form-group col-span-2">

                <label>Contact Lens Brand & Type *</label>

                <input 

                  type="text" 

                  id="modal-input-brand" 

                  class="clo-modal-input" 

                  placeholder="e.g. Biofinity Multifocals (trials), Air Optix for Astigmatism, Oasys"

                  value="${this.escapeAttr(o.brand)}"

                >

                <div class="clo-brand-chips">

                  <span class="chip-label">Quick Brands:</span>

                  <button type="button" class="bento-chip" data-set-brand="Biofinity Multifocals (trials)">Biofinity Multi (trials)</button>

                  <button type="button" class="bento-chip" data-set-brand="Air Optix for Astigmatism (trials)">Air Optix Astig (trials)</button>

                  <button type="button" class="bento-chip" data-set-brand="Oasys Multifocals (trials)">Oasys Multi (trials)</button>

                  <button type="button" class="bento-chip" data-set-brand="Ultra for Astigmatism (reg)">Ultra Astig (reg)</button>

                  <button type="button" class="bento-chip" data-set-brand="Acuvue 2">Acuvue 2</button>

                  <button type="button" class="bento-chip" data-set-brand="Biofinity Toric XR">Biofinity Toric XR</button>

                  <button type="button" class="bento-chip" data-set-brand="Air Optix Colors">Air Optix Colors</button>

                  <button type="button" class="bento-chip" data-set-brand="Dailies Total 1">Dailies Total 1</button>

                </div>

              </div>



              <!-- Fitting & Doctor Notes under Patient -->

              <div class="clo-form-group col-span-2">

                <label>Fitting / Dispensing Notes (Prints under patient name on sheet)</label>

                <input 

                  type="text" 

                  id="modal-input-notes" 

                  class="clo-modal-input" 

                  placeholder="e.g. 'CAN TAKE AND TRY', *NEEDS FITTING. WILL OWE $50*, DONT CALL"

                  value="${this.escapeAttr(o.patientNotes)}"

                >

                <div class="clo-brand-chips">

                  <button type="button" class="bento-chip" data-set-note='"CAN TAKE AND TRY"'>"CAN TAKE AND TRY"</button>

                  <button type="button" class="bento-chip" data-set-note="*NEEDS FITTING. WILL OWE $50*">*NEEDS FITTING. WILL OWE $50*</button>

                  <button type="button" class="bento-chip" data-set-note="DONT CALL. SHE WILL CALL TO SCHEDULE FIT">DONT CALL</button>

                  <button type="button" class="bento-chip" data-set-note="*FIT SCHEDULED*">*FIT SCHEDULED*</button>

                  <button type="button" class="bento-chip" data-set-note="*ORDERED 3 PAIRS*">*ORDERED 3 PAIRS*</button>

                </div>

              </div>



              <!-- Prescription Section -->

              <div class="clo-rx-section-box col-span-2">

                <div class="clo-rx-header">

                  <h4>Contact Lens Prescription</h4>

                  <button type="button" class="clo-btn clo-btn-ghost btn-copy-rx-left" style="font-size: 0.8rem; padding: 4px 10px;">

                    ⇄ Copy Right Eye to Left Eye

                  </button>

                </div>



                <div class="clo-rx-inputs-grid">

                  <!-- Right Eye -->

                  <div class="clo-rx-col">

                    <span class="rx-eye-badge badge-od">OD (Right Eye)</span>

                    <div class="clo-form-group">

                      <label>Rx (Right):</label>

                      <input 

                        type="text" 

                        id="modal-input-rx-r" 

                        class="clo-modal-input" 

                        placeholder="e.g. -1.25 -2.25 x 100 or +1.75 +2.00 N"

                        value="${this.escapeAttr(o.rxRight)}"

                      >

                    </div>

                    <div class="clo-form-group">

                      <label># Qty (Right):</label>

                      <input 

                        type="text" 

                        id="modal-input-qty-r" 

                        class="clo-modal-input" 

                        style="max-width: 90px;"

                        placeholder="1"

                        value="${this.escapeAttr(o.qtyRight || '1')}"

                      >

                    </div>

                  </div>



                  <!-- Left Eye -->

                  <div class="clo-rx-col">

                    <span class="rx-eye-badge badge-os">OS (Left Eye)</span>

                    <div class="clo-form-group">

                      <label>Rx (Left):</label>

                      <input 

                        type="text" 

                        id="modal-input-rx-l" 

                        class="clo-modal-input" 

                        placeholder="e.g. -0.50 -1.75 x 090 or same both eyes"

                        value="${this.escapeAttr(o.rxLeft)}"

                      >

                    </div>

                    <div class="clo-form-group">

                      <label># Qty (Left):</label>

                      <input 

                        type="text" 

                        id="modal-input-qty-l" 

                        class="clo-modal-input" 

                        style="max-width: 90px;"

                        placeholder="1"

                        value="${this.escapeAttr(o.qtyLeft || '1')}"

                      >

                    </div>

                  </div>

                </div>

              </div>



              <!-- Billing & Payment -->

              <div class="clo-form-group">

                <label>Amount Due</label>

                <input 

                  type="text" 

                  id="modal-input-amt" 

                  class="clo-modal-input" 

                  placeholder="e.g. trials, $130.00, $220.00"

                  value="${this.escapeAttr(o.amtDue || 'trials')}"

                >

                <div class="clo-brand-chips">

                  <button type="button" class="bento-chip" data-set-amt="trials">trials</button>

                  <button type="button" class="bento-chip" data-set-amt="$130.00">$130.00</button>

                  <button type="button" class="bento-chip" data-set-amt="$220.00">$220.00</button>

                  <button type="button" class="bento-chip" data-set-amt="$280.00">$280.00</button>

                </div>

              </div>



              <div class="clo-form-group">

                <label>Paid? (Pd?)</label>

                <input 

                  type="text" 

                  id="modal-input-pd" 

                  class="clo-modal-input" 

                  placeholder="e.g. - or Yes"

                  value="${this.escapeAttr(o.paid || '-')}"

                >

                <div class="clo-brand-chips">

                  <button type="button" class="bento-chip" data-set-pd="-">- (Unpaid)</button>

                  <button type="button" class="bento-chip" data-set-pd="Yes">Yes (Paid)</button>

                  <button type="button" class="bento-chip" data-set-pd="VSP">VSP Insurance</button>

                </div>

              </div>



            </div>



          </div>



          <div class="clo-modal-footer">

            <button type="button" class="clo-btn clo-btn-ghost" id="btn-cancel-doctor-modal">Cancel</button>

            <button type="button" class="clo-btn clo-btn-accent" id="btn-submit-doctor-order" style="padding: 10px 24px; font-weight: 700;">

              <span>✅ Mark as Ordered & Send to Waiting Sheet</span>

            </button>

          </div>



        </div>

      </div>

    `;

  }



  // Render Search Past History Table

  renderHistoryTable() {

    let filtered = [...this.state.allOrders];



    // Status filter

    if (this.state.historyFilter === 'pending') {

      filtered = filtered.filter(o => o.status === 'pending_doctor' || !o.doctorOrdered);

    } else if (this.state.historyFilter === 'ordered') {

      filtered = filtered.filter(o => o.status === 'ordered');

    } else if (this.state.historyFilter === 'received') {

      filtered = filtered.filter(o => o.status === 'received');

    } else if (this.state.historyFilter === 'called') {

      filtered = filtered.filter(o => o.status === 'called');

    } else if (this.state.historyFilter === 'completed') {

      filtered = filtered.filter(o => o.status === 'completed');

    }



    // Query search filter

    if (this.state.searchQuery.trim()) {

      const q = this.state.searchQuery.toLowerCase();

      filtered = filtered.filter(o =>

        (o.patient || '').toLowerCase().includes(q) ||

        (o.phone || '').toLowerCase().includes(q) ||

        (o.brand || '').toLowerCase().includes(q) ||

        (o.dateOrdered || '').toLowerCase().includes(q) ||

        (o.dateReceived || '').toLowerCase().includes(q) ||

        (o.drawer || '').toLowerCase().includes(q) ||

        (o.patientNotes || '').toLowerCase().includes(q)

      );

    }



    if (filtered.length === 0) {

      return `

        <div class="clo-empty-history">

          <p>No contact lens orders match your search criteria.</p>

        </div>

      `;

    }



    return `

      <table class="clo-history-table">

        <thead>

          <tr>

            <th>Date Ordered</th>

            <th>Patient Name</th>

            <th>Phone</th>

            <th>CL Brand</th>

            <th>Rx (OD / OS)</th>

            <th>Amt Due</th>

            <th>Pd?</th>

            <th>Date Received</th>

            <th>Drawer</th>

            <th>Date Called</th>

            <th>Status</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          ${filtered.map(order => `

            <tr>

              <td>${this.escapeHtml(order.dateOrdered)}</td>

              <td>

                <div class="font-bold">${this.escapeHtml(order.patient)}</div>

                ${order.patientNotes ? `<div class="text-xs text-amber-700">${this.escapeHtml(order.patientNotes)}</div>` : ''}

              </td>

              <td>${this.escapeHtml(order.phone)}</td>

              <td>${this.escapeHtml(order.brand || 'Awaiting Dr')}</td>

              <td class="text-xs font-mono">

                <div>OD: ${this.escapeHtml(order.rxRight || '-')} (#${order.qtyRight || '1'})</div>

                <div>OS: ${this.escapeHtml(order.rxLeft || '-')} (#${order.qtyLeft || '1'})</div>

              </td>

              <td>${this.escapeHtml(order.amtDue || '-')}</td>

              <td>${this.escapeHtml(order.paid || '-')}</td>

              <td>${this.escapeHtml(order.dateReceived || '-')}</td>

              <td class="font-bold">${this.escapeHtml(order.drawer || '-')}</td>

              <td>${this.escapeHtml(order.dateCalled || '-')}</td>

              <td>

                <span class="status-pill status-${order.status || 'ordered'}">

                  ${order.status === 'pending_doctor' ? 'Pending Dr' : (order.status === 'completed' ? 'Picked Up' : order.status)}

                </span>

              </td>

              <td>

                <button type="button" class="clo-btn clo-btn-ghost btn-open-doctor-modal" data-order-id="${order.id}" style="padding: 4px 8px; font-size: 0.75rem;">

                  Edit Rx

                </button>

              </td>

            </tr>

          `).join('')}

        </tbody>

      </table>

    `;

  }



  bindEvents() {

    // 1. Tab switches

    const tabBtns = this.container.querySelectorAll('.clo-tab-btn');

    tabBtns.forEach(btn => {

      btn.addEventListener('click', (e) => {

        e.preventDefault();

        const tab = btn.getAttribute('data-tab');

        this.switchTab(tab);

      });

    });



    // 2. Daily pad inputs

    const padInputs = this.container.querySelectorAll('.clo-input');

    padInputs.forEach(input => {

      input.addEventListener('input', (e) => {

        const rowIdx = parseInt(input.getAttribute('data-row'), 10);

        const field = input.getAttribute('data-field');

        if (this.state.rows[rowIdx]) {

          this.state.rows[rowIdx][field] = e.target.value;

          this.notifyChange();

        }

      });

    });



    // 3. Send Daily Row to Doctor

    const docRowBtns = this.container.querySelectorAll('.clo-row-doctor-btn');

    docRowBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const rowIdx = parseInt(btn.getAttribute('data-row-idx'), 10);

        this.sendDailyRowToDoctor(rowIdx);

      });

    });



    // 4. Send all filled to doctor

    const sendAllBtn = this.container.querySelector('#btn-send-all-doctor');

    if (sendAllBtn) {

      sendAllBtn.addEventListener('click', () => this.sendAllFilledToDoctor());

    }



    // 5. Quick Add bar (Daily pad)

    const quickAddBtn = this.container.querySelector('#btn-quick-add');

    if (quickAddBtn) {

      quickAddBtn.addEventListener('click', () => {

        const nameInput = this.container.querySelector('#quick-input-name');

        const dobInput = this.container.querySelector('#quick-input-dob');

        const phoneInput = this.container.querySelector('#quick-input-phone');

        const boxesInput = this.container.querySelector('#quick-input-boxes');

        const instInput = this.container.querySelector('#quick-input-instructions');



        const name = (nameInput?.value || '').trim();

        if (!name) {

          alert('Please enter a patient name');

          return;

        }



        const nextEmpty = this.state.rows.findIndex(r => !(r.name || '').trim());

        const targetIdx = nextEmpty !== -1 ? nextEmpty : this.state.rows.length;



        const newRow = {

          id: targetIdx + 1,

          name: name,

          dob: this.formatDob(dobInput?.value || ''),

          phone: this.formatPhone(phoneInput?.value || ''),

          boxes: boxesInput?.value?.trim() || '1 box each',

          instructions: instInput?.value?.trim() || '',

          status: 'pending_doctor',

          orderId: `cl_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`

        };



        if (targetIdx < this.state.rows.length) {

          this.state.rows[targetIdx] = newRow;

        } else {

          this.state.rows.push(newRow);

        }



        this.notifyChange();

        this.render();

        this.bindEvents();

      });

    }



    // Quantity spinner & amount buttons (X Boxes, X Boxes Each)

    const qtyInput = this.container.querySelector('#quick-qty-num');

    const updateQtyLabels = () => {

      const val = parseInt(qtyInput?.value || '1', 10) || 1;

      const lblBoxes = this.container.querySelector('#label-qty-boxes');

      const lblBoxesEach = this.container.querySelector('#label-qty-boxes-each');

      if (lblBoxes) lblBoxes.textContent = val === 1 ? '1 Box' : `${val} Boxes`;

      if (lblBoxesEach) lblBoxesEach.textContent = val === 1 ? '1 Box Each' : `${val} Boxes Each`;

    };



    if (qtyInput) {

      qtyInput.addEventListener('input', updateQtyLabels);

      qtyInput.addEventListener('change', updateQtyLabels);

    }



    const btnQtyBoxes = this.container.querySelector('#btn-qty-boxes');

    if (btnQtyBoxes) {

      btnQtyBoxes.addEventListener('click', () => {

        const val = parseInt(qtyInput?.value || '1', 10) || 1;

        const boxesInput = this.container.querySelector('#quick-input-boxes');

        if (boxesInput) boxesInput.value = val === 1 ? '1 Box' : `${val} Boxes`;

      });

    }



    const btnQtyBoxesEach = this.container.querySelector('#btn-qty-boxes-each');

    if (btnQtyBoxesEach) {

      btnQtyBoxesEach.addEventListener('click', () => {

        const val = parseInt(qtyInput?.value || '1', 10) || 1;

        const boxesInput = this.container.querySelector('#quick-input-boxes');

        if (boxesInput) boxesInput.value = val === 1 ? '1 Box each' : `${val} Boxes each`;

      });

    }



    // Billing pre-fills (Self Pay, Eyemed, VSP, Spectera, Versant, Premier Vision, Other)

    const billingChips = this.container.querySelectorAll('.chip-billing');

    billingChips.forEach(chip => {

      chip.addEventListener('click', () => {

        const plan = chip.getAttribute('data-quick-billing');

        const instInput = this.container.querySelector('#quick-input-instructions');

        if (instInput) {

          const current = (instInput.value || '').trim();

          if (!current || ['Self Pay', 'Eyemed', 'VSP', 'Spectera', 'Versant', 'Premier Vision', 'Other'].includes(current)) {

            instInput.value = plan;

          } else if (!current.includes(plan)) {

            instInput.value = `${plan} - ${current}`;

          }

        }

      });

    });



    // Special Instructions / Allowance Checkbox

    const chkSpecial = this.container.querySelector('#chk-special-instructions-toggle');

    const allowanceDiv = this.container.querySelector('#bento-allowance-details');

    if (chkSpecial && allowanceDiv) {

      chkSpecial.addEventListener('change', () => {

        allowanceDiv.style.display = chkSpecial.checked ? 'block' : 'none';

        if (chkSpecial.checked) {

          const instInput = this.container.querySelector('#quick-input-instructions');

          if (instInput && !instInput.value.trim()) {

            instInput.value = 'Eyemed - Only $50 allowance left from original $250';

          }

        }

      });

    }



    // Allowance Presets

    const allowancePresets = this.container.querySelectorAll('.chip-allowance-preset');

    allowancePresets.forEach(preset => {

      preset.addEventListener('click', () => {

        const note = preset.getAttribute('data-allowance');

        const instInput = this.container.querySelector('#quick-input-instructions');

        if (instInput) {

          const cur = (instInput.value || '').trim();

          if (!cur) {

            instInput.value = note;

          } else if (['Self Pay', 'Eyemed', 'VSP', 'Spectera', 'Versant', 'Premier Vision', 'Other'].includes(cur)) {

            instInput.value = `${cur} - ${note}`;

          } else {

            instInput.value = `${cur}, ${note}`;

          }

        }

      });

    });



    // Custom Allowance Calculator

    const btnApplyCustom = this.container.querySelector('#btn-apply-custom-allowance');

    if (btnApplyCustom) {

      btnApplyCustom.addEventListener('click', () => {

        const rem = this.container.querySelector('#custom-allowance-rem')?.value || '50';

        const orig = this.container.querySelector('#custom-allowance-orig')?.value || '250';

        const note = `Only $${rem} allowance left from original $${orig}`;

        const instInput = this.container.querySelector('#quick-input-instructions');

        if (instInput) {

          const cur = (instInput.value || '').trim();

          if (!cur) {

            instInput.value = note;

          } else if (['Self Pay', 'Eyemed', 'VSP', 'Spectera', 'Versant', 'Premier Vision', 'Other'].includes(cur)) {

            instInput.value = `${cur} - ${note}`;

          } else {

            instInput.value = `${cur}, ${note}`;

          }

        }

      });

    }



    // 6. Quick Chips

    const chips = this.container.querySelectorAll('.bento-chip');

    chips.forEach(chip => {

      chip.addEventListener('click', () => {

        const box = chip.getAttribute('data-quick-box');

        const ins = chip.getAttribute('data-quick-ins');

        const setBrand = chip.getAttribute('data-set-brand');

        const setNote = chip.getAttribute('data-set-note');

        const setAmt = chip.getAttribute('data-set-amt');

        const setPd = chip.getAttribute('data-set-pd');



        if (box) {

          const bInput = this.container.querySelector('#quick-input-boxes');

          if (bInput) bInput.value = box;

        }

        if (ins) {

          const iInput = this.container.querySelector('#quick-input-instructions');

          if (iInput) iInput.value = ins;

        }

        if (setBrand && this.state.activeDoctorModalOrder) {

          const brandInp = this.container.querySelector('#modal-input-brand');

          if (brandInp) {

            brandInp.value = setBrand;

            this.state.activeDoctorModalOrder.brand = setBrand;

          }

        }

        if (setNote && this.state.activeDoctorModalOrder) {

          const noteInp = this.container.querySelector('#modal-input-notes');

          if (noteInp) {

            noteInp.value = setNote;

            this.state.activeDoctorModalOrder.patientNotes = setNote;

          }

        }

        if (setAmt && this.state.activeDoctorModalOrder) {

          const amtInp = this.container.querySelector('#modal-input-amt');

          if (amtInp) {

            amtInp.value = setAmt;

            this.state.activeDoctorModalOrder.amtDue = setAmt;

          }

        }

        if (setPd && this.state.activeDoctorModalOrder) {

          const pdInp = this.container.querySelector('#modal-input-pd');

          if (pdInp) {

            pdInp.value = setPd;

            this.state.activeDoctorModalOrder.paid = setPd;

          }

        }

      });

    });



    // 7. Print buttons (Daily pad)

    const printPadFilled = this.container.querySelector('#btn-print-pad-filled');

    if (printPadFilled) printPadFilled.addEventListener('click', () => this.printDailySheet());



    const printPadBlank = this.container.querySelector('#btn-print-pad-blank');

    if (printPadBlank) printPadBlank.addEventListener('click', () => this.printBlankDailySheet());



    const clearPadBtn = this.container.querySelector('#btn-clear-daily-pad');

    if (clearPadBtn) clearPadBtn.addEventListener('click', () => this.reset());



    // 8. Print buttons (Waiting sheet)

    const printPickupFilled = this.container.querySelector('#btn-print-pickup-filled');

    if (printPickupFilled) printPickupFilled.addEventListener('click', () => this.printPickupSheet());



    const printPickupBlank = this.container.querySelector('#btn-print-pickup-blank');

    if (printPickupBlank) printPickupBlank.addEventListener('click', () => this.printBlankPickupSheet());



    // 9. Waiting sheet inputs & quick actions

    const pickupInputs = this.container.querySelectorAll('.pickup-cell-input');

    pickupInputs.forEach(input => {

      input.addEventListener('change', (e) => {

        const orderId = input.getAttribute('data-order-id');

        const field = input.getAttribute('data-field');

        this.updatePickupField(orderId, field, e.target.value);

      });

    });



    const receivedTodayBtns = this.container.querySelectorAll('[data-action="received-today"]');

    receivedTodayBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const id = btn.getAttribute('data-order-id');

        this.markOrderReceivedToday(id);

      });

    });



    const calledTodayBtns = this.container.querySelectorAll('[data-action="called-today"]');

    calledTodayBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const id = btn.getAttribute('data-order-id');

        this.markOrderCalledToday(id);

      });

    });



    const lvmBtns = this.container.querySelectorAll('[data-action="called-lvm"]');

    lvmBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const id = btn.getAttribute('data-order-id');

        this.markOrderLvm(id);

      });

    });



    const completeBtns = this.container.querySelectorAll('[data-action="complete-pickup"]');

    completeBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const id = btn.getAttribute('data-order-id');

        this.markOrderCompleted(id);

      });

    });



    // 10. Doctor queue modal buttons

    const openDocBtns = this.container.querySelectorAll('.btn-open-doctor-modal');

    openDocBtns.forEach(btn => {

      btn.addEventListener('click', () => {

        const id = btn.getAttribute('data-order-id');

        this.openDoctorOrderModal(id);

      });

    });



    const manualDoctorOrderBtn = this.container.querySelector('#btn-manual-doctor-order');

    if (manualDoctorOrderBtn) {

      manualDoctorOrderBtn.addEventListener('click', () => {

        const newId = `cl_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        this.state.activeDoctorModalOrder = {

          id: newId,

          dateOrdered: this.state.batchDate,

          patient: '',

          patientNotes: '',

          phone: '',

          dob: '',

          brand: '',

          rxRight: '',

          qtyRight: '1',

          rxLeft: '',

          qtyLeft: '1',

          amtDue: 'trials',

          paid: '-',

          dateReceived: '',

          drawer: '',

          dateCalled: '',

          status: 'pending_doctor',

          doctorOrdered: false,

          boxesRequested: '1 box each',

          frontInstructions: ''

        };

        this.render();

        this.bindEvents();

      });

    }



    const switchToPickupFromDoc = this.container.querySelector('#btn-switch-to-pickup-from-doc');

    if (switchToPickupFromDoc) {

      switchToPickupFromDoc.addEventListener('click', () => this.switchTab('pickup'));

    }



    // Modal close & submit

    const closeDocModal = this.container.querySelector('#btn-close-doctor-modal');

    if (closeDocModal) closeDocModal.addEventListener('click', () => this.closeDoctorOrderModal());



    const cancelDocModal = this.container.querySelector('#btn-cancel-doctor-modal');

    if (cancelDocModal) cancelDocModal.addEventListener('click', () => this.closeDoctorOrderModal());



    const copyRxLeftBtn = this.container.querySelector('.btn-copy-rx-left');

    if (copyRxLeftBtn) {

      copyRxLeftBtn.addEventListener('click', () => {

        const rxR = this.container.querySelector('#modal-input-rx-r')?.value || '';

        const qtyR = this.container.querySelector('#modal-input-qty-r')?.value || '1';

        const rxL = this.container.querySelector('#modal-input-rx-l');

        const qtyL = this.container.querySelector('#modal-input-qty-l');

        if (rxL) rxL.value = rxR;

        if (qtyL) qtyL.value = qtyR;

        if (this.state.activeDoctorModalOrder) {

          this.state.activeDoctorModalOrder.rxLeft = rxR;

          this.state.activeDoctorModalOrder.qtyLeft = qtyR;

        }

      });

    }



    const submitDocModal = this.container.querySelector('#btn-submit-doctor-order');

    if (submitDocModal) {

      submitDocModal.addEventListener('click', () => {

        if (!this.state.activeDoctorModalOrder) return;

        const brandInp = this.container.querySelector('#modal-input-brand');

        const notesInp = this.container.querySelector('#modal-input-notes');

        const rxRInp = this.container.querySelector('#modal-input-rx-r');

        const qtyRInp = this.container.querySelector('#modal-input-qty-r');

        const rxLInp = this.container.querySelector('#modal-input-rx-l');

        const qtyLInp = this.container.querySelector('#modal-input-qty-l');

        const amtInp = this.container.querySelector('#modal-input-amt');

        const pdInp = this.container.querySelector('#modal-input-pd');



        this.state.activeDoctorModalOrder.brand = brandInp?.value || '';

        this.state.activeDoctorModalOrder.patientNotes = notesInp?.value || '';

        this.state.activeDoctorModalOrder.rxRight = rxRInp?.value || '';

        this.state.activeDoctorModalOrder.qtyRight = qtyRInp?.value || '1';

        this.state.activeDoctorModalOrder.rxLeft = rxLInp?.value || '';

        this.state.activeDoctorModalOrder.qtyLeft = qtyLInp?.value || '1';

        this.state.activeDoctorModalOrder.amtDue = amtInp?.value || 'trials';

        this.state.activeDoctorModalOrder.paid = pdInp?.value || '-';



        this.submitDoctorOrder();

      });

    }



    // 11. History Search

    const searchInput = this.container.querySelector('#clo-history-search-input');

    if (searchInput) {

      searchInput.addEventListener('input', (e) => {

        this.state.searchQuery = e.target.value;

        const historyContainer = this.container.querySelector('.clo-history-table-container');

        if (historyContainer) {

          historyContainer.innerHTML = this.renderHistoryTable();

          // re-bind edit buttons inside table

          const editBtns = historyContainer.querySelectorAll('.btn-open-doctor-modal');

          editBtns.forEach(btn => {

            btn.addEventListener('click', () => {

              const id = btn.getAttribute('data-order-id');

              this.openDoctorOrderModal(id);

            });

          });

        }

      });

    }



    const clearSearchBtn = this.container.querySelector('#btn-clear-search');

    if (clearSearchBtn) {

      clearSearchBtn.addEventListener('click', () => {

        this.state.searchQuery = '';

        this.render();

        this.bindEvents();

      });

    }



    const filterPills = this.container.querySelectorAll('.clo-filter-pill');

    filterPills.forEach(pill => {

      pill.addEventListener('click', () => {

        const f = pill.getAttribute('data-filter');

        this.state.historyFilter = f;

        this.render();

        this.bindEvents();

      });

    });



    // 12. Manual pickup row addition

    const addManualPickupRowBtn = this.container.querySelector('#btn-add-manual-pickup-row');

    if (addManualPickupRowBtn) {

      addManualPickupRowBtn.addEventListener('click', () => {

        const pName = prompt('Enter Patient Name:');

        if (!pName || !pName.trim()) return;

        const brand = prompt('Enter Contact Lens Brand:', 'Biofinity Multifocals (trials)');

        const rxR = prompt('Enter Rx Right (OD):', '-1.25');

        const rxL = prompt('Enter Rx Left (OS):', '-1.25');



        const newOrder = {

          id: `cl_order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,

          dateOrdered: this.state.batchDate,

          patient: pName.trim(),

          patientNotes: '',

          phone: '',

          dob: '',

          brand: brand || '',

          rxRight: rxR || '',

          qtyRight: '1',

          rxLeft: rxL || '',

          qtyLeft: '1',

          amtDue: 'trials',

          paid: '-',

          dateReceived: '',

          drawer: '',

          dateCalled: '',

          status: 'ordered',

          doctorOrdered: true,

          boxesRequested: '1 box each',

          frontInstructions: '',

          updatedAt: new Date().toISOString()

        };



        this.state.allOrders.unshift(newOrder);

        this.notifyChange();

        this.render();

        this.bindEvents();

      });

    }

  }

}

