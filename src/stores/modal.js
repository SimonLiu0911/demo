import { defineStore } from 'pinia';

export const useModalStore = defineStore('modal', {
  state: () => ({
    modal: {},
    modalContent: {}
  }),
  actions: {
    storeModalContent (payload) {
      this.modalContent = {};
      this.modalContent = payload;
    },
    popupModal (payload) {
      this.modal = payload;
    },
    closeModal () {
      this.modal.show = false;
    }
  }
});
