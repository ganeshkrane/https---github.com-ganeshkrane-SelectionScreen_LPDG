sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/comp/library',
    'sap/ui/model/type/String',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/SearchField',
	'sap/m/Token',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/odata/v2/ODataModel',
	'sap/ui/table/Column',
	'sap/m/Column',
	'sap/m/Text'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,compLibrary, TypeString, ColumnListItem, Label, SearchField, Token, Filter, FilterOperator, ODataModel, UIColumn, MColumn, Text) {
        "use strict";

        return Controller.extend("mares.selectionscreen.controller.V1", {
            onInit: function () {

            },
            onSearch:function(oEvent){
                this._oBasicSearchField = new SearchField();
                if (!this.pDialog) {
                    this.pDialog = this.loadFragment({
                        name: "mares.selectionscreen.view.Selection"
                    });
                }
               
                this.pDialog.then(function(oDialog) {
                    var oFilterBar = oDialog.getFilterBar();
                    this._oVHD = oDialog;
                    // Initialise the dialog with model only the first time. Then only open it
                   
                    this.getView().addDependent(oDialog);
    
                    // Set key fields for filtering in the Define Conditions Tab
                    // oDialog.setRangeKeyFields([{
                    //     label: "Product",
                    //     key: "ProductCode",
                    //     type: "string",
                    //     typeInstance: new TypeString({}, {
                    //         maxLength: 7
                    //     })
                    // }]);
    
                    // Set Basic Search for FilterBar
                    oFilterBar.setFilterBarExpanded(false);
                   // oFilterBar.setBasicSearch(this._oBasicSearchField);
    
                    // Trigger filter bar search when the basic search is fired
                    // this._oBasicSearchField.attachSearch(function() {
                    //     oFilterBar.search();
                    // });
    
                    oDialog.getTableAsync().then(function (oTable) {
                        var jsonModel= new sap.ui.model.json.JSONModel("./model/Data.json");
                        oTable.setModel(jsonModel);
                        
                        // For Desktop and tabled the default table is sap.ui.table.Table
                        if (oTable.bindRows) {
                            //oTable.unBindRows();
                            oTable.removeAllColumns();
                            //oTable.removeAllRows();
                            // Bind rows to the ODataModel and add columns
                            oTable.bindAggregation("rows", {
                                path: "/results",
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new UIColumn({label: "Functional Location", template: "tplnr"}));
                            oTable.addColumn(new UIColumn({label: "Name1", template: "Name1"}));
                            oTable.addColumn(new UIColumn({label: "Name2", template: "Name2"}));
                            oTable.addColumn(new UIColumn({label: "Plz", template: "plz"}));
                            oTable.addColumn(new UIColumn({label: "Ort", template: "Ort"}));
                            oTable.addColumn(new UIColumn({label: "Street", template: "street"}));
                            oTable.addColumn(new UIColumn({label: "House Number", template: "houseNum"}));
                         // oTable.addColumn(new UIColumn({label: "Number of Contact Person", template: "pernr"}));
                            
                            
                        }
    
                        // For Mobile the default table is sap.m.Table
                        if (oTable.bindItems) {
                            // Bind items to the ODataModel and add columns
                            
                            oTable.removeAllColumns();
                            //oTable.removeAllitems();

                            oTable.bindAggregation("items", {
                                path: "/results",
                                template: new ColumnListItem({
                                    cells: [new Label({text: "{tplnr}"}),
                                    new Label({text: "{name1}"}),
                                    new Label({text: "{name2}"}),
                                    new Label({text: "{plz}"}),
                                    new Label({text: "{street}"}),
                                    new Label({text: "{houseNum}"}),
                                 //   new Label({text: "{pernr}"}),
                                    ]
                                    
                                }),
                                events: {
                                    dataReceived: function() {
                                        oDialog.update();
                                    }
                                }
                            });
                            oTable.addColumn(new MColumn({header: new Label({text: "Functional Location"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "Name1"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "Name2"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "Plz"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "Ort"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "Street"})}));
                            oTable.addColumn(new MColumn({header: new Label({text: "House Number"})}));
                           // oTable.addColumn(new MColumn({header: new Label({text: "Number of Contact Person"})}));
                            
                            
                            
                            
                        }
                        
                        oDialog.update();
                    }.bind(this));
                        // set flag that the dialog is initialized
                        this._bDialogInitialized = true;
                        oDialog.open();
                }.bind(this));
				
            },
            onValueHelpOkPress: function (oEvent) {
                var that=this;
                this._oVHD.getTableAsync().then(function (oTable) {
               
                var data=oTable.getModel().getData().results;
                var Index=oTable.getSelectedIndex();
                var tplnr= data[Index].tplnr;
                that.byId("tplnrInput").setVisible(false);
                that.byId("searchBtn").setVisible(false);
                that.byId("tplnrTxt").setText(tplnr);
                that.byId("tplnrTxt").setVisible(true);
                that.byId("DRLbl").setVisible(true);
                that.byId("DRP1").setVisible(true);
                that.byId("EditContinueBtn").setVisible(true);
                that.byId("backBtn").setVisible(true);
                



            });
            this._oVHD.close();

            },
    
            onValueHelpCancelPress: function () {
                this._oVHD.close();
            },

            onBack:function(){
                this.byId("tplnrInput").setVisible(true);
                this.byId("searchBtn").setVisible(true);
                this.byId("tplnrTxt").setText();
                this.byId("tplnrTxt").setVisible(false);
                this.byId("DRLbl").setVisible(false);
                this.byId("DRP1").setVisible(false);
                this.byId("EditContinueBtn").setVisible(false);
                this.byId("backBtn").setVisible(false);
            },
        });
    });
