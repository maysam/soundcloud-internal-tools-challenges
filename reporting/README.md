# The Challenge

There's an HTTP endpoint that responds with the last months support requests in CSV format with how many iteractions were in the request (field `requestLength` e.g. how many emails or other communications it took between the user and support before the issue was resolved) and how many minutes were spent resolving the issue (field `requestTime`).  The issues are assigned grouped into categories, A through to G, depending on the type of request (e.g. account access, copyright issues etc). The data also includes the country of the request.

We'd like to have a report that summarises this data:

* Number & time spent on requests per category
* Average number of interactions per category
* Total Time spent per day

Data from the country code 'US' should be excluded from all these totals.

## Accessing the data

The data is provided from the following URL. The URL remains constant for each month - the data is simply refreshed regularly

https://help-assets.soundcloud.com/reporting/support_report.csv

It is actually a semi-colon (;) separated file, with \n line endings.

## Process

The scenario is that this process would need to be run each month, so create _something_ that can generate this summary data, displayed in any form you like - it could be output on the terminal, it could generate a file of some sort, it could even generate charts, but note we don't expect this to be a perfect tidy solution. We're looking for pragmatism and thinking about what makes most sense for the people using this data. The report will eventually be read by humans to identify trends, but outputting a machine-readable format is fine for a first step, especially if you add some notes about how you might present that data.

You can use whatever tools or programming language you like, just be sure to include instructions about how to run (and compile, if necessary) your script or process. Please submit only source code, no binaries. We're fine installing dependencies, as long as there's instructions on how to do that. It should be able to run on Mac or Linux.

This is a process that would need to be completed once a month, possibly more often, so the more automation the better.

The file is representative of the amount of data to process - it might grow a little, but your process doesn't need to handle gigabytes of data.

## Notes

We expect this challenge to take around an hour. However, there is no time limit. If you're part way through, you're welcome to submit notes as to how you would proceed with more time.

As we can't provide real data, the data in use at the given URL is generated random data for the purpose of this challenge.
