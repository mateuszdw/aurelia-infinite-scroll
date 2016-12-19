import {inject, bindable, customAttribute, DOM} from 'aurelia-framework';

@customAttribute('infinite-scroll')
@inject(DOM.Element)
export class InfiniteScrollCustomAttribute {

  isTicking = false;

  @bindable callback;
  @bindable scrollBuffer = 10;
  @bindable isActive = true;

  static ScrollEventName = 'scroll';

  constructor(element) {
    this.element = element;
  }

  attached() {
    this.element.scrollTop = this.element.scrollHeight;
    this.element.addEventListener(InfiniteScrollCustomAttribute.ScrollEventName, this.onScrollChange);
    this.onScrollChange();
  }

  detached() {
    this.element.removeEventListener(InfiniteScrollCustomAttribute.ScrollEventName, this.onScrollChange);
  }

  callbackChanged(newCallback) {
    this.callback = newCallback;
  }

  scrollBufferChanged(buffer) {
    this.scrollBuffer = +buffer;
  }

  isActiveChanged(isActive) {
    this.isActive = (isActive === 'true');
  }

  onScrollChange = () => {
    if (!this.isActive) {
      return false;
    }

    if (!this.isTicking) {
      window.requestAnimationFrame(() => {
        this.checkScrollPosition();
        this.isTicking = false;
      });
    }

    this.isTicking = true;
  };

  checkScrollPosition() {

    const containerScrollPosition = this.element.scrollTop;
    const containerHeight = this.element.scrollHeight - this.element.offsetHeight;

    if(this.callback && containerHeight != 0 && containerScrollPosition === containerHeight){
      this.callback();
    }
  };

}
