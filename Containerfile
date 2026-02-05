# Copy files into builder image for single-layer copy into main image
FROM scratch AS copyfiles
COPY server/index.js /copyfiles/server/
COPY server/static/css/*.css /copyfiles/server/static/css/
COPY server/static/img/*.png /copyfiles/server/static/img/
COPY server/static/img/*.jpg /copyfiles/server/static/img/
COPY server/static/js/*.js /copyfiles/server/static/js/
COPY server/static/views/*.hbs /copyfiles/server/static/views/
COPY package.json package-lock.json LICENSE /copyfiles/

# Main image build
FROM node:20-bookworm
COPY --from=copyfiles /copyfiles/ /opt/fbsim-ui/
WORKDIR /opt/fbsim-ui
RUN npm install --omit=dev
CMD ["npm", "run", "prod:server"]
