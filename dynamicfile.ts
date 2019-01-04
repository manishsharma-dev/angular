import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from "@angular/forms";
import { ApiService } from '../../../api-services/api.services'

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
    isActive: boolean = false;
    showMenu: string = '';
    pushRightClass: string = 'push-right';
    LeftMenu: any[] = [];
    TempJSON: any = new Object;
    pageLoadStatus = 1;

    menuJSON = []; trsh = []
    data=[];
    constructor(private translate: TranslateService, public router: Router, private api: ApiService) {
        this.DynamicLeftMenu();        
        this.BfsBindMenu();
        
        this.translate.addLangs(['en', 'fr', 'ur', 'es', 'it', 'fa', 'de']);
        this.translate.setDefaultLang('en');
        const browserLang = this.translate.getBrowserLang();
        this.translate.use(browserLang.match(/en|fr|ur|es|it|fa|de/) ? browserLang : 'en');
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    BfsBindMenu = function () {
        try {
            if (localStorage.getItem("Userid") != null) {
                this.id = localStorage.getItem("Userid");

            }
            this.api.readTableList("BFSTABLEUSERPAGEACCESSVIEW", "", "", this.id, "|", "1").subscribe((response) => {
                this.data = response;
            }, (err) => {
                err;
            }, () => {  })
        }
        catch (ex) {            
        }
    };

    DynamicLeftMenu = function () {
        var UserId = null;
        try {
            if ((localStorage.getItem("Userid").toString() != "")
                && (localStorage.getItem("Userid").toString() != null)
                && (localStorage.getItem("Userid").toString() != undefined)) {

            }
            this.api.readTableList('BFSPortalSiteMapView', "", "", localStorage.getItem("Userid").toString(), "|", "1").subscribe(
                (response) => {
                    this.LeftMenu = this.api.MenuNestedJSON(response);
                }, (err) => {
                    err;
                }, () => {  });
        }
        catch (ex) {          
        }
    };   

    EntitySession(EntityName,MenuText,ref) {
        if (EntityName != null && EntityName != "") {
            localStorage.setItem("EntityName", EntityName);
            sessionStorage.setItem("EntityName", EntityName); 
            localStorage.setItem("LabelText", MenuText);
           // localStorage.setItem("TableAreaClass", TableAreaClas);
            localStorage.setItem("operationName", ref);
        }
    };
    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }



    @Output() toggleEvent = new EventEmitter();
    changeFormat() {
        this.pageLoadStatus = 0;
        this.toggleEvent.emit(this.pageLoadStatus);
    }

    changeData() {
        this.pageLoadStatus = 1;
        this.toggleEvent.emit(this.pageLoadStatus);
    }
}
