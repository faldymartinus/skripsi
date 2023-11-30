FROM node:16
WORKDIR /usr/src/app
ARG buildtime_variable=mongodb+srv://carkirAdmin:armeldeafaldyfarhanyogayusuf@cluster0.xjc9q.mongodb.net/?retryWrites=true&w=majority
ENV CONNECTION_STRING=$buildtime_variable
ENV SECRET_KEY=wRfM2yaUCpJq-SZZWK_NEyn94PQozKT2-NuTASAlxlV3gelP32VSk59BT300L8owzEivMcgc_Kx_LfoXN2oc9zwNDIIwWOnl5emWwHLNE47TSzXqOg1ZzTA-nvOt_m6AIImLnHERg3oNDO48c-jsiF528wSIaXjAXp46AOxfcmBTlCEmeaud5kga6KdjC1MwgKIBTUvo

COPY package*.json ./
RUN npm install

COPY . ./

CMD ["node", "server.js"]
