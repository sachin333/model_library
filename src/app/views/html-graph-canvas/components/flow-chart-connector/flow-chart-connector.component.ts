import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewContainerRef, ViewRef, ComponentRef, AfterViewInit } from '@angular/core';
import { IFlowChartConnectionElement } from '../IFlowChartConnectionElement';
import { IFlowChartInputElement, IFlowChartOutputElement } from '../IFlowChartElement';
import { fromEvent, Subscription, Observable } from 'rxjs';
import { ActionConnectorCanvas, Dimension } from 'src/app/views/svggraph-canvas/action-connector-handler';
import { merge } from 'rxjs/operators';

@Component({
  selector: 'app-flow-chart-connector',
  templateUrl: './flow-chart-connector.component.html',
  styleUrls: ['./flow-chart-connector.component.sass']
})
export class FlowChartConnectorComponent implements OnInit, IFlowChartConnectionElement, OnDestroy, AfterViewInit {



  private parentNodeObj: IFlowChartInputElement<HTMLElement>;
  private childNodeObj: IFlowChartOutputElement<HTMLElement>;
  private subscription: Subscription;
  private viewRef: ComponentRef<IFlowChartConnectionElement>;

  @ViewChild('connectorElement')
  private connectorElement: ElementRef<HTMLDivElement>;

  set parentNode(val: IFlowChartInputElement<HTMLElement>) {

    if (this.parentNodeObj) {
      throw new Error('Re-initializtion not allowed');
    }

    this.parentNodeObj = val;

    if (val) {
      this.subscription.add(val.dragEvent().subscribe(this.redraw));
      this.subscription.add(val.destroyEvent().subscribe(this.remove));
      this.element.removeAttribute('disabled'); // enable pointer event on connector
    }
    this.redraw();
  }
  set childNode(val: IFlowChartOutputElement<HTMLElement>) {
    if (this.childNodeObj) {
      throw new Error('Re-initializtion not allowed');
    }
    this.childNodeObj = val;
    if (val) {
      this.subscription.add(val.dragEvent().subscribe(this.redraw));
      this.subscription.add(val.destroyEvent().subscribe(this.remove));
    }
    this.redraw();
  }

  get element(): HTMLElement {
    return this.connectorElement.nativeElement;
  }

  setComponentRef(val: ComponentRef<IFlowChartConnectionElement>) {
    this.viewRef = val;
  }
  redraw = () => {

    if (!this.parentNodeObj || !this.childNodeObj) {
      return;
    }

    this.element.style.zIndex = this.element.parentElement.querySelectorAll('.flow-chart-item').length + '';

    const divTopLeft = this.element.children.item(0);
    const divMiddle = this.element.children.item(1);
    const divRightBottom = this.element.children.item(2);
    const img: HTMLElement = this.element.children.item(3) as HTMLElement;


    const pRect = this.parentNodeObj.getBoundingRect();
    const cRect = this.childNodeObj.getBoundingRect();

    let x = pRect.left + (pRect.width / 2);
    let y = pRect.top + (pRect.height / 2);

    let w = cRect.left + (cRect.width / 2) - x;
    let h = cRect.top - y + (pRect.height / 2);


    img.style.bottom = 0 + 'px';
    img.style.right = 'calc(-100% + 8px)';

    this.element.style.transform = 'none';

    img.classList.remove('axis-new');
    divTopLeft.classList.remove('axis-new');
    divMiddle.classList.remove('axis-new');
    divRightBottom.classList.remove('axis-new');

    let transformStyle = '';
    if (w < 0) {
      x += w;
      w = Math.abs(w);
      // this.element.classList.add('flip-x');
      transformStyle = 'scaleX(-1)';
    }




    if (h < 20) {
      // x = pRect.left + pRect.width;
      y = pRect.top + (pRect.height / 2);
      // w = cRect.left - x;
      h = cRect.top + (cRect.height / 2) - y;
    }
    if (h < 0) {
      y += h;
      h = Math.abs(h);
      transformStyle = `${transformStyle} scaleY(-1)`;
    }

    this.element.style.transform = transformStyle;



    const hGap = (y + h) - (pRect.top + pRect.height + (cRect.height / 2));

    if (hGap < 20 && !((cRect.top + cRect.height + 20) < pRect.top) && w > ((cRect.width / 2) + 10)) {
      divTopLeft.classList.add('axis-new');
      divRightBottom.classList.add('axis-new');
      divMiddle.classList.add('axis-new');
      img.classList.add('axis-new');
      img.style.bottom = '13px';
      img.style.right = `calc(-100% + ${(cRect.width / 2) + 10}px)`;
    } else {
      img.style.bottom = `${(cRect.height / 2) + 15}px`;
    }


    // if (cRect.left < pRect.left) {
    //   x = cRect.left + (cRect.width / 2);
    //  w = (pRect.left + pRect.width / 2) - cRect.left - (cRect.width / 2);
    // this.element.classList.add('flip-left');

    /* if (h < 20) {
       if (pRect.top > cRect.top) {
         const temp = pRect;
         pRect = cRect;
         cRect = temp;
       }
       x = pRect.left + pRect.width;
       y = pRect.top + (pRect.height / 2);
       w = cRect.left - x;
       h = cRect.top + (cRect.height / 2) - y;
     }*/
    //}



    /* console.log('--------00');
     if (pRect.left > cRect.left) {
       console.log('--------01');
       x = cRect.left + (cRect.width / 2);
       w = pRect.left + (pRect.width / 2) - x;
       this.element.querySelector('.line-top-left-middle').classList.add('flip-bottom');
       this.element.querySelector('.line-botton-right-middle').classList.add('flip-top');
 
     }
 
     if (cRect.top < (pRect.top + pRect.height)) {
       x = pRect.left + pRect.width;
       w = cRect.left - x;
       console.log('--------02', cRect.top, pRect.top + pRect.height);
       const a1 = ['flip-left'];
       const a2 = ['flip-left'];
       const a3 = ['flip-left'];
 
       if (pRect.left > cRect.left) {
 
         x = cRect.left + cRect.width;
         w = pRect.left - x;
         a1.push('flip-left-reverse');
         a2.push('flip-left-reverse');
       }
 
       y = pRect.top + (pRect.height / 2);
       h = cRect.top + (cRect.height / 2) - y;
       this.element.querySelector('.line-top-left-middle').classList.add(...a1);
       this.element.querySelector('.line-botton-right-middle').classList.add(...a2);
       this.element.querySelector('.line-left-right-middle').classList.add(...a3);
     }
 */
    // this.adjustLine(this.parentNodeObj, this.childNodeObj, this.element);
    this.setRect(x, y, w, h);

  }

  remove = () => {
    try {
      this.parentNode.removeChild(this.childNodeObj);
    } catch (err) { }
    try {
      this.childNodeObj.removeParent(this.parentNodeObj);
    } catch (err) { }

    this.subscription.unsubscribe();
    this.parentNodeObj = null;
    this.childNodeObj = null;
    this.viewRef.destroy();

  }


  constructor(private viewContainerRef: ViewContainerRef) {
    this.subscription = new Subscription();
    console.log(viewContainerRef);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.remove();
  }
  setRect(x: number, y: number, width: number, height: number) {
    if (this.connectorElement) {
      const ele: HTMLElement = this.connectorElement.nativeElement;

      if (!isNaN(x)) {
        ele.style.left = x + 'px';
      }

      if (!isNaN(y)) {
        ele.style.top = y + 'px';
      }
      if (!isNaN(width)) {
        ele.style.width = width + 'px';
      }
      if (!isNaN(height)) {
        ele.style.height = height + 'px';
      }
    }
  }
  ngAfterViewInit(): void {
    const eventArr: Observable<any>[] = [];
    this.element.childNodes.forEach((child) => {
      eventArr.push(fromEvent(child, 'mouseover')); // .subscribe(() => (child as HTMLElement).classList.add('line-hover-style'));
      eventArr.push(fromEvent(child, 'mouseout')); // .subscribe(() => (child as HTMLElement).classList.remove('line-hover-style'));
    });
    // merge<any>(...eventArr).
  }
}
