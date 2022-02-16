new Vue({
    el: '#app',
    data: {
      pressures: [],

      newPressure1: 130,
      newPressure2: 80,
      currentMonth: null,
      currentYear: null,
      note: null,
      showNote: false,
      showHistoryNote: false
    },
    mounted() {
        const month = new Date().getMonth()+1 < 10 ? '0' + (new Date().getMonth()+1) : new Date().getMonth()+1;
        this.currentMonth = month;
        this.currentYear = new Date().getFullYear();
        this.scrollToBottomOfHistory()
        if (localStorage.getItem('pressures')) {
            try {
                this.pressures = JSON.parse(localStorage.getItem('pressures'));
                // console.log(this.pressures)
            } catch(e) {
                localStorage.removeItem('pressures');
            }
        }
    },
    methods: {
      addPressure() {
        // ensure they actually typed something
        if (!this.newPressure1) {
          return;
        }
        if (this.newPressure1 > 220 || this.newPressure1 < 80) {
            this.newPressure1 = 130;
            return
        }
        if (this.newPressure2 > 160 || this.newPressure1 < 30) {
            this.newPressure1 = 80;
            return
        }
        const current = new Date();
        // const month = current.getMonth()+1 < 10 ? '0' + (current.getMonth()+1) : current.getMonth()+1;
        const dateDay = current.getDate() < 10 ? '0' + current.getDate() : current.getDate();
        const minutes = current.getMinutes() < 10 ? '0' + current.getMinutes(): current.getMinutes();
        const time = current.getHours() + ":" + minutes;
        // const dateTime = date +' '+ time;
        
        this.pressures.push({
            pressure1 : this.newPressure1,
            pressure2 : this.newPressure2,
            dateYear : this.currentYear,
            dateMonth : this.currentMonth,
            dateDay : dateDay,
            time : time,
            note: this.note
        });
        this.newPressure1 = 130;
        this.newPressure2 = 80;
        this.savePressures();
        this.scrollToBottomOfHistory()
      },
      removePressure(x) {
        this.pressures.splice(x, 1);
        this.savePressures();
      },
      savePressures() {
        const parsed = JSON.stringify(this.pressures);
        localStorage.setItem('pressures', parsed);
      },
      plusOne() {
        this.newPressure1 = this.newPressure1 + 1;
      },
      minusOne() {
        this.newPressure1 = this.newPressure1 - 1;
      },
      scrollToBottomOfHistory() {
        setTimeout(() => {
            var objDiv = document.getElementById('history');
            objDiv.scrollTop = objDiv.scrollHeight
        }, 0)
      },
      getClass(pressure) {
        return {
            'text-green-300': pressure.pressure1 >= 105 && pressure.pressure1 < 130,
            'text-orange-300': pressure.pressure1 >= 130 && pressure.pressure1 < 140,
            'text-red-300': pressure.pressure1 >= 140 && pressure.pressure1 < 150,
            'text-red-400': pressure.pressure1 >= 150 && pressure.pressure1 < 160,
            'text-red-500': pressure.pressure1 >= 160 && pressure.pressure1 < 170,
          }
      },
      changeSelectedMonthNext() {
          if (parseInt(this.currentMonth) < 12) {
              let nextNumber = parseInt(this.currentMonth) + 1;
            this.currentMonth = nextNumber < 10 ? '0' + nextNumber : nextNumber
          } 
          else {
            this.currentYear = parseInt(this.currentYear) + 1
            this.currentMonth = '01' 
          }
      },
      changeSelectedMonthPrev() {
        if (parseInt(this.currentMonth) > 1) {
            let prevNumber = parseInt(this.currentMonth) - 1;
          this.currentMonth = prevNumber < 10 ? '0' + prevNumber : prevNumber
        } 
        else {
            this.currentYear = parseInt(this.currentYear) - 1
            this.currentMonth = '12' 
        }
       },
       csvExport() {
        //    let arrData = this.pressures;
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += [
          Object.keys(this.pressures[0]).join(";"),
          ...this.pressures.map(item => Object.values(item).join(";"))
        ]
          .join("\n")
          .replace(/(^\[)|(\]$)/gm, "");
  
        const data = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", data);
        link.setAttribute("download", "Mojecisnienia.csv");
        link.click();
      },
      pdfExport() {
        window.jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();
        this.pressures.forEach(function(pressure, i){
            doc.text(20, 10 + (i * 10), 
                pressure.dateYear + 
                '/' + pressure.dateMonth + 
                '/' + pressure.dateDay +
                ' ' + pressure.time +   
                ' | ' + pressure.pressure1 +
                " / " + pressure.pressure2 +
                '  mmHg'
                );
        });
        doc.save('Mojecisnienia.pdf');
      }
      
    }
  });

  