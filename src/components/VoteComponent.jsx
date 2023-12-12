import { Button, Card, Divider, Flex, Heading, Radio, RadioGroup, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

function VoteComponent({contract, fromAddress, changeStatus}) {
    const [isAbleToVote, setAbleToVote] = useState(false);

    const [isStarted, setStarted] = useState(false);
    const [isFinished, setFinished] = useState(false);
    
    const [candidates, setCandidates] = useState([]);
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [voteIsLoading, setVoteIsLoading] = useState(false);

    const retrieveVoterStatus = async () => {
        const isAble = await contract.methods.isAbleToVote(fromAddress).call();

        setAbleToVote(isAble);
    }

    const retrieveStatus = async () => {
        const started = await contract.methods.getVotingIsStarted().call();
        const finished = await contract.methods.getVotingIsFinished().call();

        setStarted(started);
        setFinished(finished);

        changeStatus(started, finished);
    }

    const retrieveCandidates = async () => {
        const result = await contract.methods.getCandidates().call();
        setCandidates(result);

        console.log(`Candidates successfully retrieved: ${result}`);
    };

    const vote = async () => {
        setVoteIsLoading(true);

        const transaction = await contract.methods.vote(selectedCandidate).send({"from": fromAddress});
        
        setVoteIsLoading(false);

        retrieveVoterStatus();
    }

    useEffect(
        () => {
            retrieveVoterStatus();
            retrieveStatus();
            retrieveCandidates();
        },
        [isAbleToVote, isStarted, isFinished, candidates]
    );

    return (
        <>
            <Heading as="h1" size="lg">Voting Section</Heading>

            <Divider my="15"/>

            {
                isStarted && !isFinished ? (
                    isAbleToVote ? (
                        <VStack spacing={4}>
                            <Heading as="h4" size="sm">Select a Candidate to Vote:</Heading>
                            <RadioGroup value={selectedCandidate} onChange={(value) => setSelectedCandidate(value)}>
                                <VStack align="center">
                                {candidates.map((address, index) => (
                                    <Card p="5">
                                        <Radio key={index} value={address}>{ address }
                                        </Radio>
                                    </Card>
                                ))}
                                </VStack>
                            </RadioGroup>
                            <Button onClick={vote} isLoading={voteIsLoading} loadingText="Voting" colorScheme="teal" isDisabled={!selectedCandidate}>
                                Vote
                            </Button>
                            </VStack>
                    ) : (
                        <Text>Oh, you're not able to vote</Text>
                    )
                ) : (
                    isFinished ? (
                        <Text color="lightgray">Voting has already finished...</Text>
                    ) : (
                        <Text color="lightgray">Voting has not started yet...</Text>
                    )
                )
            }

            
        </>
    );
}

export default VoteComponent;