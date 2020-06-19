#!/bin/bash
systemctl start postgresql
sudo -u postgres psql -U postgres -f database.pgsql 
exit && exit
