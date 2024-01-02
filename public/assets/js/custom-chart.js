(function ($) {
    "use strict";
    let dailyOrderArray = document.getElementById("dailyOrderArray").value;

    dailyOrderArray = dailyOrderArray.trim(); // Remove leading and trailing whitespace
    dailyOrderArray = dailyOrderArray.split(",");
    dailyOrderArray = dailyOrderArray.map((item) => Number(item));
    dailyOrderArray = Array(dailyOrderArray);
    dailyOrderArray = dailyOrderArray[0];
    console.log(dailyOrderArray,"dailyOrderArray123");
  
        if ($('#myChartWeekly').length) {
            var ctx = document.getElementById('myChartWeekly').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
    
                data: {
                    labels: [
                      
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                            'Sunday'
                        
                    ],
                    datasets: [{
                            label: 'Weekly',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(44, 120, 220, 0.2)',
                            borderColor: 'rgba(44, 120, 220)',
                            data: dailyOrderArray
                        }
    
                    ]
                },
             
                options: {
                    plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        
                        },
                    }
                    }
                }
            });
        } 
    
    
        
    })(jQuery);
    


    (function ($) {
        "use strict";
        let monthlySalesArray = document.getElementById("monthlySalesArray").value;
 
        monthlySalesArray = monthlySalesArray.trim(); // Remove leading and trailing whitespace
        monthlySalesArray = monthlySalesArray.split(",");
        monthlySalesArray = monthlySalesArray.map((item) => Number(item));
        monthlySalesArray = Array(monthlySalesArray);
        monthlySalesArray = monthlySalesArray[0];
    
        if ($('#myChartWeekly').length) {
            var ctx = document.getElementById('myChartMonthly').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
    
                data: {
                    labels: [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ],
                    datasets: [{
                        label: 'Monthly',
                        tension: 0.3,
                        fill: true,
                        backgroundColor: 'rgba(4, 209, 130, 0.2)',
                        borderColor: 'rgb(4, 209, 130)',
                            data: monthlySalesArray
                        }
    
                    ]
                },
             
                options: {
                    plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        
                        },
                    }
                    }
                }
            });
        } 
    
    
        
    })(jQuery);

     
    (function ($) {
        "use strict";
        let yearlyOrderCounts = document.getElementById("yearlyOrderCounts").value;
    
        yearlyOrderCounts = yearlyOrderCounts.trim(); // Remove leading and trailing whitespace
        yearlyOrderCounts = yearlyOrderCounts.split(",");
        yearlyOrderCounts = yearlyOrderCounts.map((item) => Number(item));
        yearlyOrderCounts = Array(yearlyOrderCounts);
        yearlyOrderCounts = yearlyOrderCounts[0];
    
        if ($('#myChartYearly').length) {
            var ctx = document.getElementById('myChartYearly').getContext('2d');
            var chart = new Chart(ctx, {
                type: 'line',
            
         
                data: {
                    labels: [
                        2017, 2018,
                        2019, 2020,
                        2021, 2022,
                        2023
                      ],
                    datasets: [
                     
                        {
                            label: 'Yearly',
                            tension: 0.3,
                            fill: true,
                            backgroundColor: 'rgba(380, 200, 230, 0.2)',
                            borderColor: 'rgb(380, 200, 230)',
                            data: yearlyOrderCounts 
                        }
    
                    ]
                },
                options: {
                    plugins: {
                    legend: {
                        labels: {
                        usePointStyle: true,
                        
                        },
                    }
                    }
                }
            });
        } 
    
    
        
    })(jQuery);