# Copy files into builder image for single-layer copy into main image
FROM scratch AS copyfiles
COPY src/*.js /copyfiles/src/
COPY static/css/*.css /copyfiles/static/css/
COPY static/img/*.png /copyfiles/static/img/
COPY static/img/*.jpg /copyfiles/static/img/
COPY static/js/*.js /copyfiles/static/js/
COPY static/views/*.hbs /copyfiles/static/views/
COPY package.json package-lock.json LICENSE /copyfiles/

# Main image build
FROM node:20-bookworm
COPY --from=copyfiles /copyfiles/ /opt/fbsim-ui/
WORKDIR /opt/fbsim-ui
RUN npm install
CMD ["npm", "run", "prod"]